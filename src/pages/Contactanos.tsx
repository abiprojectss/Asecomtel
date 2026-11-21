import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2, ArrowRight, X, ShieldCheck } from 'lucide-react';
import Reveal from '../components/Reveal';
import LocationMapPreview from '../components/LocationMapPreview';
import {
  FIELD_LIMITS,
  validateEmail,
  validatePersonName,
  validatePhone,
  validateTextBlock,
} from '../../api/_validation';

type ContactField =
  | 'nombre'
  | 'apellidos'
  | 'numeros'
  | 'email'
  | 'mensaje'
  | 'privacidadAceptada';

export default function Contactanos() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    numeros: '',
    email: '',
    mensaje: '',
    privacidadAceptada: false,
    website: '',
  });

  const validateContactForm = () => {
    const errors: Partial<Record<ContactField, string>> = {};
    const nombreErr = validatePersonName(formData.nombre, 'El nombre');
    const apellidosErr = validatePersonName(formData.apellidos, 'Los apellidos');
    const phoneErr = validatePhone(formData.numeros, false);
    const emailErr = validateEmail(formData.email);
    const mensajeErr = validateTextBlock(formData.mensaje, {
      required: true,
      min: FIELD_LIMITS.messageMin,
      max: FIELD_LIMITS.messageMax,
      label: 'Comentario o mensaje',
    });

    if (nombreErr) errors.nombre = nombreErr;
    if (apellidosErr) errors.apellidos = apellidosErr;
    if (phoneErr) errors.numeros = phoneErr;
    if (emailErr) errors.email = emailErr;
    if (mensajeErr) errors.mensaje = mensajeErr;
    if (!formData.privacidadAceptada) {
      errors.privacidadAceptada = 'Debes aceptar la Política de Privacidad para continuar.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateContactForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          ...formData,
        }),
      });
      const rawText = await response.text();
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = JSON.parse(rawText) as { ok?: boolean; error?: string };
      } catch {
        setSubmitError(
          `El servidor no devolvió una respuesta válida (HTTP ${response.status}). Recarga la página o inténtalo en unos segundos.`
        );
        return;
      }

      if (!response.ok || !data.ok) {
        setSubmitError(data.error || 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
        return;
      }

      setFormSubmitted(true);
    } catch {
      setSubmitError('Error de conexión al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setSubmitError(null);
    setFieldErrors({});
    setFormData({
      nombre: '',
      apellidos: '',
      numeros: '',
      email: '',
      mensaje: '',
      privacidadAceptada: false,
      website: '',
    });
  };

  return (
    <div className="bg-white">
      {/* Page Banner */}
      <section className="bg-[#00355F] text-white py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Contáctanos
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo comercial te asesorará sin compromiso para encontrar la mejor solución de telecomunicaciones para tu empresa.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#EAF1FF]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Contact Info + Compact Map Preview */}
          <Reveal className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#D2E4FF] rounded-xl p-6 sm:p-7 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-widest text-[#00355F] mb-1">
                Encuentranos en
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#00355F] tracking-tight mb-6">
                AsecomTel
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF1FF] text-[#00355F] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                      DIRECCION
                    </h3>
                    <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed">
                      Calle San Luis, 46, 2ºB, 30730 San Javier (Murcia)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF1FF] text-[#00355F] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                      TELEFONO CONTACTO
                    </h3>
                    <a
                      href="tel:968959545"
                      className="text-[#00355F] font-bold hover:underline text-base"
                    >
                      968 959 545
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#EAF1FF] text-[#00355F] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                      E-MAIL
                    </h3>
                    <a
                      href="mailto:info@asecomtel.es"
                      className="text-[#00355F] font-bold hover:underline text-base"
                    >
                      info@asecomtel.es
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Google Maps Preview */}
            <LocationMapPreview />
          </Reveal>

          {/* Right Column: Contact Form & Data Protection Notice */}
          <Reveal delay={0.08} className="lg:col-span-7 bg-white border border-[#D2E4FF] rounded-xl p-6 sm:p-8 shadow-xs">
            {formSubmitted ? (
              <div className="text-center py-14 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-900">¡Mensaje enviado!</h3>
                <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto">
                  Gracias por ponerte en contacto con AsecomTel. Responderemos a tu solicitud a la
                  mayor brevedad.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm font-semibold text-[#00355F] hover:underline cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="hidden"
                />

                <div>
                  <h2 className="text-2xl font-bold text-[#00355F] mb-1">
                    Envíanos tu consulta
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Los campos marcados con <span className="text-red-500 font-semibold">*</span> son obligatorios.
                  </p>
                </div>

                {/* Nombre * -> Nombre & Apellidos */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        required
                        maxLength={FIELD_LIMITS.nameMax}
                        autoComplete="given-name"
                        aria-invalid={Boolean(fieldErrors.nombre)}
                        value={formData.nombre}
                        onChange={(e) => {
                          setFormData({ ...formData, nombre: e.target.value });
                          if (fieldErrors.nombre) {
                            setFieldErrors({ ...fieldErrors, nombre: undefined });
                          }
                        }}
                        placeholder="Nombre"
                        aria-label="Nombre"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 text-sm focus:ring-2 outline-hidden transition-all ${
                          fieldErrors.nombre
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#00355F] focus:ring-[#D2E4FF]'
                        }`}
                      />
                      <span className="block text-[11px] text-slate-500 mt-1">Nombre</span>
                      {fieldErrors.nombre && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {fieldErrors.nombre}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        maxLength={FIELD_LIMITS.nameMax}
                        autoComplete="family-name"
                        aria-invalid={Boolean(fieldErrors.apellidos)}
                        value={formData.apellidos}
                        onChange={(e) => {
                          setFormData({ ...formData, apellidos: e.target.value });
                          if (fieldErrors.apellidos) {
                            setFieldErrors({ ...fieldErrors, apellidos: undefined });
                          }
                        }}
                        placeholder="Apellidos"
                        aria-label="Apellidos"
                        className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 text-sm focus:ring-2 outline-hidden transition-all ${
                          fieldErrors.apellidos
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#00355F] focus:ring-[#D2E4FF]'
                        }`}
                      />
                      <span className="block text-[11px] text-slate-500 mt-1">Apellidos</span>
                      {fieldErrors.apellidos && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {fieldErrors.apellidos}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Números */}
                <div>
                  <label
                    htmlFor="contact-numeros"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Números
                  </label>
                  <input
                    id="contact-numeros"
                    type="tel"
                    inputMode="tel"
                    maxLength={FIELD_LIMITS.phoneMax}
                    autoComplete="tel"
                    aria-invalid={Boolean(fieldErrors.numeros)}
                    value={formData.numeros}
                    onChange={(e) => {
                      setFormData({ ...formData, numeros: e.target.value });
                      if (fieldErrors.numeros) {
                        setFieldErrors({ ...fieldErrors, numeros: undefined });
                      }
                    }}
                    placeholder="Teléfono de contacto (ej. 600 123 456)"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 text-sm focus:ring-2 outline-hidden transition-all ${
                      fieldErrors.numeros
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-[#00355F] focus:ring-[#D2E4FF]'
                    }`}
                  />
                  {fieldErrors.numeros && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.numeros}</p>
                  )}
                </div>

                {/* Correo electrónico * */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={FIELD_LIMITS.emailMax}
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                    }}
                    placeholder="correo@ejemplo.com"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 text-sm focus:ring-2 outline-hidden transition-all ${
                      fieldErrors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-[#00355F] focus:ring-[#D2E4FF]'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Comentario o mensaje * */}
                <div>
                  <label
                    htmlFor="contact-mensaje"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Comentario o mensaje <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-mensaje"
                    rows={4}
                    required
                    maxLength={FIELD_LIMITS.messageMax}
                    aria-invalid={Boolean(fieldErrors.mensaje)}
                    value={formData.mensaje}
                    onChange={(e) => {
                      setFormData({ ...formData, mensaje: e.target.value });
                      if (fieldErrors.mensaje) {
                        setFieldErrors({ ...fieldErrors, mensaje: undefined });
                      }
                    }}
                    placeholder="Escribe aquí tu comentario, duda o mensaje..."
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 text-sm focus:ring-2 outline-hidden transition-all resize-none ${
                      fieldErrors.mensaje
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-[#00355F] focus:ring-[#D2E4FF]'
                    }`}
                  />
                  {fieldErrors.mensaje && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.mensaje}</p>
                  )}
                </div>

                {/* Politica de privacidad * */}
                <div className="space-y-2 pt-1">
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Politica de privacidad <span className="text-red-500">*</span>
                  </span>
                  <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-700">
                    <input
                      type="checkbox"
                      required
                      checked={formData.privacidadAceptada}
                      onChange={(e) => {
                        setFormData({ ...formData, privacidadAceptada: e.target.checked });
                        if (fieldErrors.privacidadAceptada) {
                          setFieldErrors({ ...fieldErrors, privacidadAceptada: undefined });
                        }
                      }}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-[#00355F] focus:ring-[#00355F] cursor-pointer"
                    />
                    <span>He leído y acepto la Política de Privacidad</span>
                  </label>
                  {fieldErrors.privacidadAceptada && (
                    <p className="text-xs font-medium text-red-600">
                      {fieldErrors.privacidadAceptada}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setPrivacyModalOpen(true)}
                    className="text-xs text-[#00355F] hover:underline font-medium text-left cursor-pointer block"
                  >
                    Haz clic en el siguiente enlace para leer la Política de Privacidad antes de aceptarla.
                  </button>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00355F] hover:bg-[#002645] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            {/* Data Protection Information */}
            <div className="mt-6 pt-5 border-t border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1.5">
              <p>
                <strong className="text-slate-800">Responsable de los datos:</strong> URBA EQUIPOS
                MEDIOAMBIENTALES, S.L.
              </p>
              <p>
                <strong className="text-slate-800">Finalidad de los datos:</strong> Responder a la
                solicitud, contestando a los comentarios, mensajes, dudas y comentarios.
              </p>
              <p>
                <strong className="text-slate-800">Almacenamiento de los datos:</strong> Base de
                datos alojada en HOSTINET, S.L. (UE)
              </p>
              <p>
                <strong className="text-slate-800">Derechos:</strong> En cualquier momento puedes
                limitar, recuperar y borrar tu información.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-100 max-h-[82vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Cerrar política de privacidad"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#EAF1FF] text-[#00355F] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#00355F]">Política de Privacidad</h3>
            </div>

            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>
                De acuerdo con lo establecido en el Reglamento General de Protección de Datos (RGPD) y la
                Ley Orgánica de Protección de Datos Personales y garantía de los derechos digitales, te
                informamos sobre el tratamiento de los datos facilitados a través de este formulario:
              </p>
              <p>
                <strong>Responsable de los datos:</strong> URBA EQUIPOS MEDIOAMBIENTALES, S.L.
              </p>
              <p>
                <strong>Finalidad de los datos:</strong> Responder a la solicitud, contestando a los
                comentarios, mensajes, dudas y comentarios.
              </p>
              <p>
                <strong>Almacenamiento de los datos:</strong> Base de datos alojada en HOSTINET, S.L.
                (UE).
              </p>
              <p>
                <strong>Derechos:</strong> En cualquier momento puedes limitar, recuperar y borrar tu
                información enviando una solicitud a{' '}
                <a href="mailto:info@asecomtel.es" className="text-[#00355F] font-semibold hover:underline">
                  info@asecomtel.es
                </a>{' '}
                o por correo postal a Calle San Luis, 46, 2ºB, 30730 San Javier (Murcia).
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, privacidadAceptada: true }));
                  setFieldErrors((prev) => ({ ...prev, privacidadAceptada: undefined }));
                  setPrivacyModalOpen(false);
                }}
                className="bg-[#00355F] text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-[#002645] transition-colors cursor-pointer"
              >
                Aceptar y cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
