import nodemailer from 'nodemailer';

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_CV_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_CV_BYTES = 3 * 1024 * 1024; // 3 MB

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
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

export async function processFormSubmission(rawPayload: unknown): Promise<SendFormResult> {
  if (!rawPayload || typeof rawPayload !== 'object') {
    return {
      status: 400,
      body: { ok: false, error: 'Datos de formulario inválidos.' },
    };
  }

  const payload = rawPayload as Record<string, unknown>;
  const type = payload.type as FormKind;

  if (type !== 'visit' && type !== 'contact' && type !== 'apply') {
    return {
      status: 400,
      body: { ok: false, error: 'Tipo de formulario no válido.' },
    };
  }

  const smtpHost = process.env.SMTP_HOST || 'mail.asecomtel.es';
  const smtpPort = Number(process.env.SMTP_PORT || '465');
  const smtpSecure =
    process.env.SMTP_SECURE !== undefined
      ? process.env.SMTP_SECURE === 'true'
      : smtpPort === 465;
  const smtpUser = process.env.SMTP_USER || 'backoffice5@asecomtel.es';
  const smtpPass = process.env.SMTP_PASS || '';

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

  const commercialRecipient = process.env.MAIL_TO_COMMERCIAL || smtpUser;
  const recruitingRecipient = process.env.MAIL_TO_RECRUITING || smtpUser;

  let to = commercialRecipient;
  let subject = '';
  let replyTo = '';
  let html = '';
  let text = '';
  const attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = [];

  if (type === 'visit') {
    const nombre = asTrimmedString(payload.nombre);
    const email = asTrimmedString(payload.email);
    const telefono = asTrimmedString(payload.telefono);
    const privacidad = payload.privacidad === true;

    if (!nombre || !email || !telefono || !privacidad) {
      return {
        status: 400,
        body: { ok: false, error: 'Por favor, completa todos los campos obligatorios.' },
      };
    }
    if (!EMAIL_REGEX.test(email)) {
      return {
        status: 400,
        body: { ok: false, error: 'El correo electrónico introducido no es válido.' },
      };
    }

    to = commercialRecipient;
    replyTo = email;
    subject = `[Web Asecomtel] Solicitud de visita comercial - ${nombre}`;
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
    const nombre = asTrimmedString(payload.nombre);
    const apellidos = asTrimmedString(payload.apellidos);
    const numeros = asTrimmedString(payload.numeros);
    const email = asTrimmedString(payload.email);
    const mensaje = asTrimmedString(payload.mensaje);
    const privacidadAceptada = payload.privacidadAceptada === true;

    if (!nombre || !apellidos || !email || !mensaje || !privacidadAceptada) {
      return {
        status: 400,
        body: { ok: false, error: 'Por favor, completa todos los campos obligatorios.' },
      };
    }
    if (!EMAIL_REGEX.test(email)) {
      return {
        status: 400,
        body: { ok: false, error: 'El correo electrónico introducido no es válido.' },
      };
    }

    to = commercialRecipient;
    replyTo = email;
    subject = `[Web Asecomtel] Nuevo mensaje de contacto - ${nombre} ${apellidos}`;
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
    const nombre = asTrimmedString(payload.nombre);
    const email = asTrimmedString(payload.email);
    const telefono = asTrimmedString(payload.telefono);
    const sobreTi = asTrimmedString(payload.sobreTi);
    const privacidadAceptada = payload.privacidadAceptada === true;

    if (!nombre || !email || !telefono || !privacidadAceptada) {
      return {
        status: 400,
        body: { ok: false, error: 'Por favor, completa todos los campos obligatorios.' },
      };
    }
    if (!EMAIL_REGEX.test(email)) {
      return {
        status: 400,
        body: { ok: false, error: 'El correo electrónico introducido no es válido.' },
      };
    }

    const cvRaw = payload.cv as Partial<CvAttachmentPayload> | undefined;
    let cvLabel = 'No adjuntado';

    if (cvRaw && typeof cvRaw === 'object' && cvRaw.contentBase64) {
      const filename = asTrimmedString(cvRaw.filename) || 'curriculum.pdf';
      const lowerName = filename.toLowerCase();
      const hasValidExt = ALLOWED_CV_EXTENSIONS.some((ext) => lowerName.endsWith(ext));

      if (!hasValidExt) {
        return {
          status: 400,
          body: {
            ok: false,
            error: 'El currículum debe estar en formato PDF, DOC o DOCX.',
          },
        };
      }

      const fileBuffer = Buffer.from(String(cvRaw.contentBase64), 'base64');
      if (fileBuffer.byteLength === 0 || fileBuffer.byteLength > MAX_CV_BYTES) {
        return {
          status: 400,
          body: {
            ok: false,
            error: 'El archivo adjunto supera el tamaño máximo permitido de 3 MB.',
          },
        };
      }

      attachments.push({
        filename,
        content: fileBuffer,
        contentType: asTrimmedString(cvRaw.contentType) || undefined,
      });
      cvLabel = `${filename} (${Math.max(1, Math.round(fileBuffer.byteLength / 1024))} KB)`;
    }

    to = recruitingRecipient;
    replyTo = email;
    subject = `[Web Asecomtel] Nueva candidatura - ${nombre}`;
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
