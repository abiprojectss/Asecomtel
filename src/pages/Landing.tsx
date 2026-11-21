import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import commercialVisitBg from '../assets/images/commercial_visit_bg_1794663223956.jpg';
import InstalacionesSection from '../components/InstalacionesSection';
import CoreServicesShowcase from '../components/CoreServicesShowcase';
import ValueServicesShowcase from '../components/ValueServicesShowcase';
import CorporateTelecomBackdrop from '../components/CorporateTelecomBackdrop';
import Reveal from '../components/Reveal';

export default function Landing() {
  const [visitForm, setVisitForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    privacidad: false,
  });
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

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
    setVisitForm({
      nombre: '',
      email: '',
      telefono: '',
      privacidad: false,
    });
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-slate-900 min-h-[480px] sm:min-h-[540px] md:min-h-[600px] flex items-center justify-center">
        {/* Background image: original photo provided by user */}
        <img
          src="/assets/aistudio/Mujeraltelefono_27a6f091.png"
          alt="Soluciones de telecomunicaciones para empresas en toda España"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05]"
        />
        {/* Dark overlay for contrast and legibility matching Figma aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/40 to-black/50" />

        {/* Real H1 Content & Real Button */}
        <Reveal className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18] max-w-3xl drop-shadow-md">
            Soluciones de telecomunicaciones para empresas en toda España
          </h1>

          <div className="mt-8 sm:mt-10">
            <Link
              to="/contactanos"
              className="inline-flex items-center justify-center bg-white hover:bg-slate-100 text-[#1b62b0] font-bold text-base md:text-lg px-8 py-3.5 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Contacta con nosotros
            </Link>
          </div>
        </Reveal>
      </section>

      {/* QUIENES SOMOS + 4 CORE SERVICES WITH SUBTLE ARCHITECTURAL TELECOM BACKDROP */}
      <div className="relative overflow-hidden bg-[#f6f8fb]">
        <CorporateTelecomBackdrop />

        {/* QUIENES SOMOS SECTION */}
        <section className="relative z-10 pt-20 md:pt-24 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b62b0] mb-8 tracking-tight">
              Quienes somos
            </h2>
            <div className="space-y-6 text-slate-700 text-base md:text-lg leading-relaxed font-normal">
              <p>
                En Asecomtel somos especialistas en soluciones de{' '}
                <span className="text-[#1b62b0] font-semibold">
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
      <section className="relative w-full overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        {/* Background Image */}
        <img
          src={commercialVisitBg}
          alt="Asesor comercial de telecomunicaciones reunido con cliente empresarial"
          referrerPolicy="no-referrer"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Subtle dark/blue overlay for depth and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-[#0f2f57]/65 to-slate-900/80" />

        <Reveal className="relative z-10 max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-white/40 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1b62b0] text-center mb-8 tracking-tight">
            ¿Quieres que te visite un comercial?
          </h2>

          {visitSubmitted ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">¡Solicitud recibida!</h3>
              <p className="text-slate-600 text-sm md:text-base">
                Gracias por tu solicitud. Un comercial se pondrá en contacto contigo en el teléfono indicado.
              </p>
              <button
                type="button"
                onClick={resetVisitForm}
                className="text-sm font-semibold text-[#1b62b0] hover:underline cursor-pointer"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleVisitSubmit} className="space-y-4">
              <div>
                <label htmlFor="visit-nombre" className="sr-only">
                  Tu nombre
                </label>
                <input
                  id="visit-nombre"
                  type="text"
                  required
                  value={visitForm.nombre}
                  onChange={(e) => setVisitForm({ ...visitForm, nombre: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-base focus:border-[#1b62b0] focus:ring-2 focus:ring-[#1b62b0]/20 outline-hidden transition-all"
                />
              </div>

              <div>
                <label htmlFor="visit-email" className="sr-only">
                  Tu correo electrónico
                </label>
                <input
                  id="visit-email"
                  type="email"
                  required
                  value={visitForm.email}
                  onChange={(e) => setVisitForm({ ...visitForm, email: e.target.value })}
                  placeholder="Tu correo electrónico"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-base focus:border-[#1b62b0] focus:ring-2 focus:ring-[#1b62b0]/20 outline-hidden transition-all"
                />
              </div>

              <div>
                <label htmlFor="visit-telefono" className="sr-only">
                  Telefono
                </label>
                <input
                  id="visit-telefono"
                  type="tel"
                  required
                  value={visitForm.telefono}
                  onChange={(e) => setVisitForm({ ...visitForm, telefono: e.target.value })}
                  placeholder="Telefono"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-base focus:border-[#1b62b0] focus:ring-2 focus:ring-[#1b62b0]/20 outline-hidden transition-all"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={visitForm.privacidad}
                    onChange={(e) => setVisitForm({ ...visitForm, privacidad: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1b62b0] focus:ring-[#1b62b0] cursor-pointer"
                  />
                  <span className="text-sm text-slate-700">
                    He leído y acepto la Política de Privacidad.
                  </span>
                </label>
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {submitError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1b62b0] hover:bg-[#165194] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          )}

          {/* Data protection information */}
          <div className="mt-7 bg-slate-50/90 border border-slate-200/80 rounded-lg p-5 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-1.5">
            <p>
              <strong className="text-slate-700">Responsable de los datos:</strong> URBA EQUIPOS
              MEDIOAMBIENTALES, S.L.
            </p>
            <p>
              <strong className="text-slate-700">Finalidad de los datos:</strong> Responder a la
              solicitud, realizando una llamada al telefono que se haya indicado en el formulario,
              ofreciendo servicios comerciales.
            </p>
            <p>
              <strong className="text-slate-700">Almacenamiento de los datos:</strong> Base de
              datos alojada en HOSTINET, S.L. (UE)
            </p>
            <p>
              <strong className="text-slate-700">Derechos:</strong> En cualquier momento puedes
              limitar, recuperar y borrar tu información.
            </p>
          </div>
        </Reveal>
      </section>

      {/* NUESTRAS INSTALACIONES (ANIMATED 5-PHOTO GALLERY) */}
      <InstalacionesSection />
    </>
  );
}
