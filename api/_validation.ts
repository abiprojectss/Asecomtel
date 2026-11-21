export const FIELD_LIMITS = {
  nameMax: 80,
  emailMax: 120,
  phoneMax: 20,
  messageMin: 10,
  messageMax: 2000,
  aboutMax: 1500,
  maxCvBytes: 3 * 1024 * 1024,
} as const;

export const ALLOWED_CV_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const PERSON_NAME_ALLOWED_REGEX = /^[\p{L}\s'’-]+$/u;
const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_CHARS_REGEX = /^\+?[\d\s()-]+$/;

export function sanitizeSingleLine(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS_REGEX, '').replace(/[\r\n]+/g, ' ').trim();
}

export function sanitizeMultiLine(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS_REGEX, '').trim();
}

export function stripHeaderNewlines(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export function validatePersonName(raw: unknown, label = 'El nombre'): string | null {
  const val = sanitizeSingleLine(raw);
  if (!val) {
    return `${label} es obligatorio.`;
  }
  if (val.length > FIELD_LIMITS.nameMax) {
    return `${label} no puede superar los ${FIELD_LIMITS.nameMax} caracteres.`;
  }
  if (/\d/.test(val)) {
    return `${label} no puede contener números.`;
  }
  if (!PERSON_NAME_ALLOWED_REGEX.test(val)) {
    return `${label} solo puede contener letras, espacios y guiones.`;
  }
  const letterCount = (val.match(/\p{L}/gu) || []).length;
  if (letterCount < 2) {
    return `${label} debe tener al menos 2 letras.`;
  }
  return null;
}

export function validateEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return 'Introduce tu correo electrónico.';
  }
  if (/[\r\n]/.test(raw)) {
    return 'El correo electrónico contiene caracteres no válidos.';
  }
  const val = raw.trim();
  if (!val) {
    return 'Introduce tu correo electrónico.';
  }
  if (val.length > FIELD_LIMITS.emailMax) {
    return `El correo electrónico no puede superar los ${FIELD_LIMITS.emailMax} caracteres.`;
  }
  if (/\s/.test(val) || val.includes('..')) {
    return 'Introduce un correo electrónico válido (ejemplo: nombre@empresa.es).';
  }
  const [localPart] = val.split('@');
  if (!localPart || localPart.startsWith('.') || localPart.endsWith('.')) {
    return 'Introduce un correo electrónico válido (ejemplo: nombre@empresa.es).';
  }
  if (!STRICT_EMAIL_REGEX.test(val) || !/\.[a-zA-Z]{2,}$/.test(val)) {
    return 'Introduce un correo electrónico válido (ejemplo: nombre@empresa.es).';
  }
  return null;
}

export function validatePhone(raw: unknown, required = true): string | null {
  const val = sanitizeSingleLine(raw);
  if (!val) {
    return required ? 'Introduce un número de teléfono.' : null;
  }
  if (val.length > FIELD_LIMITS.phoneMax) {
    return 'El número de teléfono es demasiado largo.';
  }
  if (!PHONE_CHARS_REGEX.test(val)) {
    return 'El teléfono solo puede contener números, espacios, guiones y prefijo +.';
  }
  if (val.includes('+') && !val.startsWith('+')) {
    return 'El prefijo + solo puede ir al principio del número.';
  }

  const digits = val.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 15) {
    return 'Introduce un número de teléfono válido (entre 9 y 15 dígitos).';
  }
  if (/^(\d)\1+$/.test(digits) || digits === '123456789' || digits === '987654321') {
    return 'El número de teléfono introducido no parece válido.';
  }
  const hasIntlPrefix = val.startsWith('+') || digits.startsWith('00');
  if (!hasIntlPrefix && digits.length === 9 && !/^[6789]/.test(digits)) {
    return 'En España el teléfono debe empezar por 6, 7, 8 o 9 (o añade prefijo con +).';
  }
  return null;
}

export function validateTextBlock(
  raw: unknown,
  options: { required: boolean; min?: number; max: number; label: string }
): string | null {
  const val = sanitizeMultiLine(raw);
  if (!val) {
    return options.required ? `El campo "${options.label}" es obligatorio.` : null;
  }
  if (options.min && val.length < options.min) {
    return `El campo "${options.label}" debe tener al menos ${options.min} caracteres.`;
  }
  if (val.length > options.max) {
    return `El campo "${options.label}" no puede superar los ${options.max} caracteres.`;
  }
  return null;
}

export function isAllowedCvFilename(filename: string): boolean {
  const lower = filename.trim().toLowerCase();
  return ALLOWED_CV_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function sanitizeCvFilename(filename: string): string {
  const base = filename.split(/[/\\]/).pop() || 'curriculum.pdf';
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^\.+/, '');
  return (cleaned || 'curriculum.pdf').slice(0, 120);
}
