import nodemailer from 'nodemailer';
import {
  FIELD_LIMITS,
  isAllowedCvFilename,
  sanitizeCvFilename,
  sanitizeMultiLine,
  sanitizeSingleLine,
  stripHeaderNewlines,
  validateEmail,
  validatePersonName,
  validatePhone,
  validateTextBlock,
} from './_validation.ts';

export type FormKind = 'visit' | 'contact' | 'apply';

export interface CvAttachmentPayload {
  filename: string;
  contentType: string;
  contentBase64: string;
}

export interface SendFormResult {
  status: number;
  body: {
    ok: boolean;
    message?: string;
    error?: string;
  };
}

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;
const BASE64_REGEX = /^[A-Za-z0-9+/=\s]+$/;
const rateLimitStore = new Map<string, number[]>();

function isRateLimited(clientIp: string): boolean {
  const key = clientIp || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_WINDOW_MS;
  const recent = (rateLimitStore.get(key) || []).filter((ts) => ts > windowStart);

  if (recent.length >= RATE_MAX_REQUESTS) {
    rateLimitStore.set(key, recent);
    return true;
  }

  recent.push(now);
  rateLimitStore.set(key, recent);

  if (rateLimitStore.size > 500) {
    for (const [storedIp, timestamps] of rateLimitStore.entries()) {
      if (!timestamps.some((ts) => ts > windowStart)) {
        rateLimitStore.delete(storedIp);
      }
    }
  }

  return false;
}

function hasValidMagicBytes(filename: string, buffer: Buffer): boolean {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) {
    return (
      buffer.byteLength >= 5 &&
      buffer[0] === 0x25 && // %
      buffer[1] === 0x50 && // P
      buffer[2] === 0x44 && // D
      buffer[3] === 0x46 && // F
      buffer[4] === 0x2d // -
    );
  }
  if (lower.endsWith('.docx')) {
    return (
      buffer.byteLength >= 4 &&
      buffer[0] === 0x50 && // P
      buffer[1] === 0x4b && // K
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    );
  }
  if (lower.endsWith('.doc')) {
    return (
      buffer.byteLength >= 8 &&
      buffer[0] === 0xd0 &&
      buffer[1] === 0xcf &&
      buffer[2] === 0x11 &&
      buffer[3] === 0xe0 &&
      buffer[4] === 0xa1 &&
      buffer[5] === 0xb1 &&
      buffer[6] === 0x1a &&
      buffer[7] === 0xe1
    );
  }
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildInfoTable(rows: Array<{ label: string; value: string }>): string {
  const trs = rows
    .map(
      ({ label, value }) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155; width: 180px; vertical-align: top;">${escapeHtml(label)}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0f172a; white-space: pre-wrap;">${escapeHtml(value)}</td>
      </tr>`
    )
    .join('');

  return `<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; background: #ffffff; border: 1px solid #e2e8f0;">${trs}</table>`;
}

function wrapEmailLayout(title: string, subtitle: string, tableHtml: string): string {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a;">
    <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
      <div style="background: #1b62b0; color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 20px;">${escapeHtml(title)}</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">${escapeHtml(subtitle)}</p>
      </div>
      <div style="padding: 20px 24px;">
        ${tableHtml}
      </div>
      <div style="padding: 14px 24px; background: #f1f5f9; font-size: 12px; color: #64748b;">
        Enviado automáticamente desde el sitio web de Asecomtel.
      </div>
    </div>
  </div>`;
}

export async function processFormSubmission(
  rawPayload: unknown,
  clientIp = ''
): Promise<SendFormResult> {
  if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) {
    return {
      status: 400,
      body: { ok: false, error: 'Datos de formulario inválidos.' },
    };
  }

  const payload = rawPayload as Record<string, unknown>;

  // Silent honeypot trap for automated spam bots
  if (typeof payload.website === 'string' && payload.website.trim().length > 0) {
    return {
      status: 200,
      body: { ok: true, message: 'Solicitud recibida.' },
    };
  }

  if (isRateLimited(clientIp)) {
    return {
      status: 429,
      body: {
        ok: false,
        error: 'Has realizado demasiados envíos seguidos. Por favor, espera unos minutos.',
      },
    };
  }

  const type = payload.type as FormKind;
  if (type !== 'visit' && type !== 'contact' && type !== 'apply') {
    return {
      status: 400,
      body: { ok: false, error: 'Tipo de formulario no válido.' },
    };
  }

  let to = '';
  let subject = '';
  let replyTo = '';
  let html = '';
  let text = '';
  const attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = [];

  const smtpHost = process.env.SMTP_HOST || 'mail.asecomtel.es';
  const smtpPort = Number(process.env.SMTP_PORT || '465');
  const smtpSecure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true'
      : smtpPort === 465;
  const smtpUser = process.env.SMTP_USER || 'backoffice5@asecomtel.es';
  const smtpPass = process.env.SMTP_PASS || '';
  const commercialRecipient = process.env.MAIL_TO_COMMERCIAL || smtpUser;
  const recruitingRecipient = process.env.MAIL_TO_RECRUITING || smtpUser;

  if (type === 'visit') {
    const nombreErr = validatePersonName(payload.nombre, 'Tu nombre');
    const emailErr = validateEmail(payload.email);
    const phoneErr = validatePhone(payload.telefono, true);
    const privacyOk = payload.privacidad === true;

    const firstError =
      nombreErr ||
      emailErr ||
      phoneErr ||
      (!privacyOk ? 'Debes aceptar la Política de Privacidad.' : null);

    if (firstError) {
      return { status: 400, body: { ok: false, error: firstError } };
    }

    const nombre = sanitizeSingleLine(payload.nombre);
    const email = sanitizeSingleLine(payload.email);
    const telefono = sanitizeSingleLine(payload.telefono);

    to = commercialRecipient;
    replyTo = stripHeaderNewlines(email);
    subject = stripHeaderNewlines(`[Web Asecomtel] Solicitud de visita comercial - ${nombre}`);
    const rows = [
      { label: 'Formulario', value: '¿Quieres que te visite un comercial? (Inicio)' },
      { label: 'Nombre', value: nombre },
      { label: 'Correo electrónico', value: email },
      { label: 'Teléfono', value: telefono },
      { label: 'Política de privacidad', value: 'Aceptada' },
    ];
    html = wrapEmailLayout(
      'Nueva solicitud de visita comercial',
      'Formulario de portada — Asecomtel',
      buildInfoTable(rows)
    );
    text = rows.map((r) => `${r.label}: ${r.value}`).join('\n');
  } else if (type === 'contact') {
    const nombreErr = validatePersonName(payload.nombre, 'El nombre');
    const apellidosErr = validatePersonName(payload.apellidos, 'Los apellidos');
    const phoneErr = validatePhone(payload.numeros, false);
    const emailErr = validateEmail(payload.email);
    const mensajeErr = validateTextBlock(payload.mensaje, {
      required: true,
      min: FIELD_LIMITS.messageMin,
      max: FIELD_LIMITS.messageMax,
      label: 'Comentario o mensaje',
    });
    const privacyOk = payload.privacidadAceptada === true;

    const firstError =
      nombreErr ||
      apellidosErr ||
      phoneErr ||
      emailErr ||
      mensajeErr ||
      (!privacyOk ? 'Debes aceptar la Política de Privacidad.' : null);

    if (firstError) {
      return { status: 400, body: { ok: false, error: firstError } };
    }

    const nombre = sanitizeSingleLine(payload.nombre);
    const apellidos = sanitizeSingleLine(payload.apellidos);
    const numeros = sanitizeSingleLine(payload.numeros);
    const email = sanitizeSingleLine(payload.email);
    const mensaje = sanitizeMultiLine(payload.mensaje);

    to = commercialRecipient;
    replyTo = stripHeaderNewlines(email);
    subject = stripHeaderNewlines(`[Web Asecomtel] Nuevo mensaje de contacto - ${nombre} ${apellidos}`);
    const rows = [
      { label: 'Formulario', value: 'Contáctanos' },
      { label: 'Nombre', value: nombre },
      { label: 'Apellidos', value: apellidos },
      { label: 'Teléfono / Números', value: numeros || 'No indicado' },
      { label: 'Correo electrónico', value: email },
      { label: 'Comentario o mensaje', value: mensaje },
      { label: 'Política de privacidad', value: 'Aceptada' },
    ];
    html = wrapEmailLayout(
      'Nuevo mensaje desde Contáctanos',
      'Consulta recibida a través de la web de Asecomtel',
      buildInfoTable(rows)
    );
    text = rows.map((r) => `${r.label}: ${r.value}`).join('\n');
  } else {
    const nombreErr = validatePersonName(payload.nombre, 'Tu nombre');
    const emailErr = validateEmail(payload.email);
    const phoneErr = validatePhone(payload.telefono, true);
    const aboutErr = validateTextBlock(payload.sobreTi, {
      required: false,
      max: FIELD_LIMITS.aboutMax,
      label: 'Sobre ti',
    });
    const privacyOk = payload.privacidadAceptada === true;

    const firstError =
      nombreErr ||
      emailErr ||
      phoneErr ||
      aboutErr ||
      (!privacyOk ? 'Debes aceptar la Política de Privacidad.' : null);

    if (firstError) {
      return { status: 400, body: { ok: false, error: firstError } };
    }

    const nombre = sanitizeSingleLine(payload.nombre);
    const email = sanitizeSingleLine(payload.email);
    const telefono = sanitizeSingleLine(payload.telefono);
    const sobreTi = sanitizeMultiLine(payload.sobreTi);

    const cvRaw = payload.cv as Partial<CvAttachmentPayload> | undefined;
    let cvLabel = 'No adjuntado';

    if (cvRaw !== undefined) {
      if (typeof cvRaw !== 'object' || cvRaw === null || Array.isArray(cvRaw)) {
        return { status: 400, body: { ok: false, error: 'Formato de archivo adjunto no válido.' } };
      }

      if (typeof cvRaw.contentBase64 === 'string' && cvRaw.contentBase64.length > 0) {
        const rawFilename = sanitizeSingleLine(cvRaw.filename) || 'curriculum.pdf';
        if (!isAllowedCvFilename(rawFilename)) {
          return {
            status: 400,
            body: {
              ok: false,
              error: 'El currículum debe estar en formato PDF, DOC o DOCX.',
            },
          };
        }

        if (cvRaw.contentBase64.length > Math.ceil(FIELD_LIMITS.maxCvBytes * 1.45)) {
          return {
            status: 400,
            body: {
              ok: false,
              error: 'El archivo adjunto supera el tamaño máximo permitido de 3 MB.',
            },
          };
        }

        if (!BASE64_REGEX.test(cvRaw.contentBase64)) {
          return {
            status: 400,
            body: { ok: false, error: 'El archivo adjunto no es válido.' },
          };
        }

        const safeFilename = sanitizeCvFilename(rawFilename);
        const fileBuffer = Buffer.from(cvRaw.contentBase64, 'base64');

        if (fileBuffer.byteLength === 0 || fileBuffer.byteLength > FIELD_LIMITS.maxCvBytes) {
          return {
            status: 400,
            body: {
              ok: false,
              error: 'El archivo adjunto supera el tamaño máximo permitido de 3 MB.',
            },
          };
        }

        if (!hasValidMagicBytes(safeFilename, fileBuffer)) {
          return {
            status: 400,
            body: {
              ok: false,
              error: 'El contenido del archivo no coincide con un PDF, DOC o DOCX válido.',
            },
          };
        }

        attachments.push({
          filename: safeFilename,
          content: fileBuffer,
          contentType: sanitizeSingleLine(cvRaw.contentType) || undefined,
        });
        cvLabel = `${safeFilename} (${Math.max(1, Math.round(fileBuffer.byteLength / 1024))} KB)`;
      }
    }

    to = recruitingRecipient;
    replyTo = stripHeaderNewlines(email);
    subject = stripHeaderNewlines(`[Web Asecomtel] Nueva candidatura - ${nombre}`);
    const rows = [
      { label: 'Formulario', value: 'Trabaja con nosotros' },
      { label: 'Nombre', value: nombre },
      { label: 'Correo electrónico', value: email },
      { label: 'Teléfono', value: telefono },
      { label: 'Sobre el candidato', value: sobreTi || 'No indicado' },
      { label: 'Currículum adjunto', value: cvLabel },
      { label: 'Política de privacidad', value: 'Aceptada' },
    ];
    html = wrapEmailLayout(
      'Nueva candidatura recibida',
      'Formulario Trabaja con nosotros — Asecomtel',
      buildInfoTable(rows)
    );
    text = rows.map((r) => `${r.label}: ${r.value}`).join('\n');
  }

  if (!smtpPass) {
    return {
      status: 422,
      body: {
        ok: false,
        error:
          'Falta configurar la contraseña SMTP (SMTP_PASS) en Secrets o variables de entorno del servidor para poder enviar correos.',
      },
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 12000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from: `"Web Asecomtel" <${smtpUser}>`,
      to,
      replyTo,
      subject,
      text,
      html,
      attachments,
    });

    return {
      status: 200,
      body: { ok: true, message: 'Correo enviado correctamente.' },
    };
  } catch (err) {
    const errObj = err as { code?: string; responseCode?: number; message?: string };
    const code = errObj?.code || '';
    const errMsg = err instanceof Error ? err.message : 'Error SMTP desconocido';
    console.error('Error enviando correo SMTP:', code, errMsg);

    let friendlyError =
      'No se pudo enviar el correo en este momento. Verifica la configuración SMTP del servidor.';
    if (code === 'EAUTH' || errObj?.responseCode === 535 || errMsg.includes('535')) {
      friendlyError =
        'El servidor de correo rechazó el usuario o la contraseña (SMTP_PASS). Verifica las credenciales de backoffice5@asecomtel.es.';
    } else if (
      errMsg.includes('certificate') ||
      errMsg.includes('TLS') ||
      code === 'ERR_TLS_CERT_ALTNAME_INVALID' ||
      code === 'DEPTH_ZERO_SELF_SIGNED_CERT'
    ) {
      friendlyError =
        'Error de verificación SSL/TLS con el servidor de correo. Revisa el nombre del servidor SMTP (SMTP_HOST).';
    } else if (
      code === 'ETIMEDOUT' ||
      code === 'ECONNREFUSED' ||
      code === 'ENOTFOUND' ||
      code === 'ESOCKET'
    ) {
      friendlyError =
        'No se pudo conectar con mail.asecomtel.es en el puerto 465 desde el servidor.';
    }

    return {
      status: 500,
      body: {
        ok: false,
        error: friendlyError,
      },
    };
  }
}
