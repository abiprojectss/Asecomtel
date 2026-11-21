import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Building2,
  PhoneCall,
  Database,
  ShieldCheck,
  Mail,
  Phone,
} from 'lucide-react';
import CoreServicesShowcase from '../components/CoreServicesShowcase';
import ValueServicesShowcase from '../components/ValueServicesShowcase';
import QuienesSomosBackdrop from '../components/QuienesSomosBackdrop';
import Reveal from '../components/Reveal';
import {
  FIELD_LIMITS,
  validateEmail,
  validatePersonName,
  validatePhone,
} from '../../api/_validation';

type VisitField = 'nombre' | 'email' | 'telefono' | 'privacidad';

export default function Landing() {
  const [visitForm, setVisitForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    privacidad: false,
    website: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<VisitField, string>>>({});
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateVisitForm = () => {
    const errors: Partial<Record<VisitField, string>> = {};
    const nombreErr = validatePersonName(visitForm.nombre, 'Tu nombre');
    const emailErr = validateEmail(visitForm.email);
    const phoneErr = validatePhone(visitForm.telefono, true);

    if (nombreErr) errors.nombre = nombreErr;
    if (emailErr) errors.email = emailErr;
    if (phoneErr) errors.telefono = phoneErr;
    if (!visitForm.privacidad) {
      errors.privacidad = 'Debes aceptar la Política de Privacidad para continuar.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateVisitForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'visit',
          ...visitForm,
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
        setSubmitError(data.error || 'No se pudo enviar la solicitud. Inténtalo de nuevo.');
        return;
      }

      setVisitSubmitted(true);
    } catch {
      setSubmitError('Error de conexión al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetVisitForm = () => {
    setVisitSubmitted(false);
    setSubmitError(null);
    setFieldErrors({});
    setVisitForm({
      nombre: '',
      email: '',
      telefono: '',
      privacidad: false,
      website: '',
    });
  };

  return (
    <>
      {/* HERO SECTION — FULL-VIEWPORT IMPACT */}
      <section className="relative w-full overflow-hidden bg-[#EAF1FF] min-h-[calc(100svh-6.75rem)] flex items-center">
        {/* Background image: wide sunlit perspective on the left, subject on the right */}
        <img
          src="/assets/aistudio/Gemini_Generated_Image_zay3b2zay3b2zay3_18bb588e.jpeg"
          alt="Soluciones de telecomunicaciones para empresas en toda España"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[64%_20%] sm:object-[62%_center] lg:object-center"
        />

        {/* Soft luminous left veil so #00355F text stays crisp over blurred foliage and railing while leaving the subject completely clear */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-white/60 sm:bg-white/50 lg:bg-transparent lg:bg-gradient-to-r lg:from-white/82 lg:via-white/50 lg:to-transparent"
        />

        {/* Subtle, compact bottom white fade across all screen sizes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-12 sm:h-16 lg:h-20 bg-gradient-to-t from-white via-white/30 to-transparent"
        />

        {/* Editorial Typography & CTA: centered on mobile, left-aligned over open sky on PC */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Reveal
            duration={0.75}
            y={18}
            className="mx-auto lg:mx-0 lg:w-[54%] xl:w-[50%] max-w-2xl text-center lg:text-left"
          >
            <h1 className="text-[clamp(2.25rem,4.1vw,3.65rem)] font-semibold text-[#00355F] tracking-tight leading-[1.08] text-balance">
              Soluciones de telecomunicaciones para empresas en toda España
            </h1>

            <p className="mt-5 text-[#00355F]/90 font-medium text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Fibra óptica simétrica, telefonía fija y móvil, IP fija y centralita virtual con
              atención comercial directa para tu negocio.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-5">
              <Link
                to="/contactanos"
                className="inline-flex items-center justify-center gap-2 bg-[#00355F] hover:bg-[#002645] text-white font-semibold text-base px-7 py-3.5 rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 whitespace-nowrap shrink-0"
              >
                <span>Contacta con nosotros</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/servicios"
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#00355F] hover:text-[#002645] underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Explorar servicios</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUIENES SOMOS + 4 CORE SERVICES */}
      <div className="bg-white">
        {/* QUIENES SOMOS SECTION */}
        <section className="relative overflow-hidden z-10 py-28 md:py-36 lg:py-40 px-4 sm:px-6 lg:px-8">
          <QuienesSomosBackdrop />

          <Reveal className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#00355F] tracking-tight">
              Quienes somos
            </h2>
            <div aria-hidden="true" className="w-12 h-1 bg-[#00355F] rounded-full mx-auto mt-3.5 mb-8" />
            <div className="space-y-6 text-slate-700 text-base md:text-lg leading-relaxed font-normal">
              <p>
                En Asecomtel somos especialistas en soluciones de{' '}
                <span className="text-[#00355F] font-semibold">
                  telecomunicaciones para empresas
                </span>
                .
              </p>
              <p>
                Acompañamos a nuestros clientes durante todo el proceso, desde la contratación y la
                instalación hasta la gestión de incidencias y la renovación de sus servicios.
              </p>
              <p>
                Contamos con un equipo comercial con presencia en todo el territorio nacional,
                comprometido con ofrecer un servicio cercano, eficiente y adaptado a cada empresa.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 4 CORE SERVICES INTERACTIVE SHOWCASE */}
        <CoreServicesShowcase />
      </div>

      {/* SERVICIOS DE VALOR AÑADIDO */}
      <ValueServicesShowcase />

      {/* ¿QUIERES QUE TE VISITE UN COMERCIAL? SECTION */}
      <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#EAF1FF] border-t border-[#D2E4FF]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, intro & data protection information card */}
          <Reveal className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#00355F] tracking-tight leading-[1.12] text-balance">
                ¿Quieres que te visite un comercial?
              </h2>
              <p className="mt-4 text-slate-700 text-base leading-relaxed">
                Déjanos tus datos y un asesor de nuestro equipo se pondrá en contacto contigo para
                estudiar tu caso y ofrecerte la mejor solución de telecomunicaciones para tu
                empresa.
              </p>
            </div>

            {/* Data protection information card */}
            <div className="bg-white rounded-2xl border border-[#D2E4FF] p-6 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-[#00355F] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold text-[#00355F]">Responsable de los datos</p>
                  <p className="text-slate-600">URBA EQUIPOS MEDIOAMBIENTALES, S.L.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PhoneCall className="w-4 h-4 text-[#00355F] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold text-[#00355F]">Finalidad de los datos</p>
                  <p className="text-slate-600">
                    Responder a la solicitud, realizando una llamada al teléfono que se haya
                    indicado en el formulario, ofreciendo servicios comerciales.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Database className="w-4 h-4 text-[#00355F] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold text-[#00355F]">Almacenamiento de los datos</p>
                  <p className="text-slate-600">Base de datos alojada en HOSTINET, S.L. (UE)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#00355F] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold text-[#00355F]">Derechos</p>
                  <p className="text-slate-600">
                    En cualquier momento puedes limitar, recuperar y borrar tu información.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Form Card */}
          <Reveal
            delay={0.18}
            className="lg:col-span-7 bg-white rounded-2xl shadow-lg border border-[#D2E4FF] p-6 sm:p-8 lg:p-9"
          >
            {visitSubmitted ? (
              <div className="bg-[#EAF1FF] border border-[#D2E4FF] rounded-xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">¡Solicitud recibida!</h3>
                <p className="text-slate-600 text-sm md:text-base">
                  Gracias por tu solicitud. Un comercial se pondrá en contacto contigo en el
                  teléfono indicado.
                </p>
                <button
                  type="button"
                  onClick={resetVisitForm}
                  className="text-sm font-semibold text-[#00355F] hover:underline cursor-pointer"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleVisitSubmit} noValidate className="space-y-5">
                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={visitForm.website}
                  onChange={(e) => setVisitForm({ ...visitForm, website: e.target.value })}
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="visit-nombre"
                      className="block text-xs font-bold text-[#00355F] mb-1.5"
                    >
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="visit-nombre"
                      type="text"
                      required
                      maxLength={FIELD_LIMITS.nameMax}
                      autoComplete="name"
                      aria-invalid={Boolean(fieldErrors.nombre)}
                      value={visitForm.nombre}
                      onChange={(e) => {
                        setVisitForm({ ...visitForm, nombre: e.target.value });
                        if (fieldErrors.nombre) setFieldErrors({ ...fieldErrors, nombre: undefined });
                      }}
                      placeholder="Tu nombre"
                      className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-slate-800 text-sm focus:ring-2 outline-hidden transition-all ${
                        fieldErrors.nombre
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-300 focus:border-[#00355F] focus:ring-[#D2E4FF]'
                      }`}
                    />
                    {fieldErrors.nombre && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {fieldErrors.nombre}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="visit-email"
                      className="block text-xs font-bold text-[#00355F] mb-1.5"
                    >
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="visit-email"
                        type="email"
                        required
                        maxLength={FIELD_LIMITS.emailMax}
                        autoComplete="email"
                        aria-invalid={Boolean(fieldErrors.email)}
                        value={visitForm.email}
                        onChange={(e) => {
                          setVisitForm({ ...visitForm, email: e.target.value });
                          if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                        }}
                        placeholder="nombre@empresa.es"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border bg-white text-slate-800 text-sm focus:ring-2 outline-hidden transition-all ${
                          fieldErrors.email
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#00355F] focus:ring-[#D2E4FF]'
                        }`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="visit-telefono"
                    className="block text-xs font-bold text-[#00355F] mb-1.5"
                  >
                    Teléfono de contacto <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="visit-telefono"
                      type="tel"
                      inputMode="tel"
                      required
                      maxLength={FIELD_LIMITS.phoneMax}
                      autoComplete="tel"
                      aria-invalid={Boolean(fieldErrors.telefono)}
                      value={visitForm.telefono}
                      onChange={(e) => {
                        setVisitForm({ ...visitForm, telefono: e.target.value });
                        if (fieldErrors.telefono) {
                          setFieldErrors({ ...fieldErrors, telefono: undefined });
                        }
                      }}
                      placeholder="Ej. 600 123 456"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-lg border bg-white text-slate-800 text-sm focus:ring-2 outline-hidden transition-all ${
                        fieldErrors.telefono
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-300 focus:border-[#00355F] focus:ring-[#D2E4FF]'
                      }`}
                    />
                  </div>
                  {fieldErrors.telefono && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {fieldErrors.telefono}
                    </p>
                  )}
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={visitForm.privacidad}
                      onChange={(e) => {
                        setVisitForm({ ...visitForm, privacidad: e.target.checked });
                        if (fieldErrors.privacidad) {
                          setFieldErrors({ ...fieldErrors, privacidad: undefined });
                        }
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#00355F] focus:ring-[#00355F] cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm text-slate-700">
                      He leído y acepto la Política de Privacidad.
                    </span>
                  </label>
                  {fieldErrors.privacidad && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      {fieldErrors.privacidad}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {submitError}
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Asesoramiento comercial gratuito y sin compromiso.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#00355F] hover:bg-[#002645] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 px-6 rounded-lg shadow-sm transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}</span>
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
