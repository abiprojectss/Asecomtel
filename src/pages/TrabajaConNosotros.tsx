import React, { useRef, useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Car,
  Mail,
  Upload,
  CheckCircle2,
  ArrowRight,
  X,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import Reveal from '../components/Reveal';

export default function TrabajaConNosotros() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    sobreTi: '',
    privacidadAceptada: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSubmitError(null);

    if (file) {
      const maxSizeBytes = 3 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setSubmitError('El currículum supera el tamaño máximo permitido de 3 MB.');
        setSelectedFile(null);
        setSelectedFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedFile(file);
      setSelectedFileName(file.name);
    } else {
      setSelectedFile(null);
      setSelectedFileName('');
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setSelectedFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('No se pudo leer el archivo adjunto.'));
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let cv: { filename: string; contentType: string; contentBase64: string } | undefined;
      if (selectedFile) {
        const contentBase64 = await fileToBase64(selectedFile);
        cv = {
          filename: selectedFile.name,
          contentType: selectedFile.type || 'application/octet-stream',
          contentBase64,
        };
      }

      const response = await fetch('/api/send-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'apply',
          ...formData,
          cv,
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
        setSubmitError(data.error || 'No se pudo enviar la candidatura. Inténtalo de nuevo.');
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError('Error de conexión al enviar la candidatura. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSubmitError(null);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      sobreTi: '',
      privacidadAceptada: false,
    });
    handleClearFile();
  };

  const requisitos = [
    {
      icon: GraduationCap,
      text: 'Graduado en Educacion Secundaria Obligatoria (ESO).',
    },
    {
      icon: Briefcase,
      text: 'Experiencia de 2 o mas años de Comercial, preferiblemente de Telefonia o Energia.',
    },
    {
      icon: Car,
      text: 'Carnet de conducir y Vehiculo Propio',
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Banner */}
      <section className="bg-gradient-to-br from-[#206ec5] via-[#1b62b0] to-[#144a84] text-white py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Trabaja con nosotros
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Únete a nuestro equipo comercial y forma parte de un distribuidor nacional en continuo crecimiento.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: ¿Buscas empleo? & ¿Que buscamos? */}
          <Reveal className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1b62b0] mb-1">
                  ¿Buscas empleo?
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Estamos esperandote
                </h2>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h3 className="text-lg font-bold text-[#1b62b0] mb-4">¿Que buscamos?</h3>
                <ul className="space-y-4">
                  {requisitos.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.text} className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-lg bg-[#1b62b0]/10 text-[#1b62b0] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                          {item.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#206ec5] via-[#1b62b0] to-[#144a84] text-white rounded-xl p-6 sm:p-7 shadow-md space-y-3">
              <h3 className="text-xl font-extrabold tracking-tight">¿Cumples los requisitos?</h3>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Envianos un correo electronico a{' '}
                <a
                  href="mailto:seleccion@asecomtel.es"
                  className="font-bold text-white underline underline-offset-4 hover:text-blue-100 transition-colors"
                >
                  seleccion@asecomtel.es
                </a>{' '}
                o rellena el siguiente formulario:
              </p>
              <a
                href="mailto:seleccion@asecomtel.es"
                className="inline-flex items-center gap-2 bg-white text-[#1b62b0] font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors mt-1"
              >
                <Mail className="w-4 h-4" />
                <span>seleccion@asecomtel.es</span>
              </a>
            </div>
          </Reveal>

          {/* Right Column: Application Form + Data Protection Info */}
          <Reveal
            delay={0.08}
            className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs"
          >
            {submitted ? (
              <div className="text-center py-14 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-900">¡Candidatura recibida!</h3>
                <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto">
                  Gracias por tu interés en formar parte de AsecomTel. Revisaremos tu currículum y
                  nos pondremos en contacto contigo.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm font-semibold text-[#1b62b0] hover:underline cursor-pointer"
                  >
                    Enviar otra candidatura
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#1b62b0] mb-1">
                    Formulario de candidatura
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Completa tus datos y adjunta tu currículum para participar en nuestros procesos de selección.
                  </p>
                </div>

                {/* Tu nombre */}
                <div>
                  <label
                    htmlFor="empleo-nombre"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Tu nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="empleo-nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:border-[#1b62b0] focus:ring-2 focus:ring-[#1b62b0]/20 outline-hidden transition-all"
                  />
                </div>

                {/* Tu correo electrónico & Telefono */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="empleo-email"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                      Tu correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="empleo-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Tu correo electrónico"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:border-[#1b62b0] focus:ring-2 focus:ring-[#1b62b0]/20 outline-hidden transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="empleo-telefono"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                      Telefono <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="empleo-telefono"
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="Telefono"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:border-[#1b62b0] focus:ring-2 focus:ring-[#1b62b0]/20 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* Escribe algo breve sobre ti (opcional) */}
                <div>
                  <label
                    htmlFor="empleo-sobre-ti"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Escribe algo breve sobre ti (opcional)
                  </label>
                  <textarea
                    id="empleo-sobre-ti"
                    rows={4}
                    value={formData.sobreTi}
                    onChange={(e) => setFormData({ ...formData, sobreTi: e.target.value })}
                    placeholder="Cuéntanos brevemente tu experiencia comercial o perfil profesional..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:border-[#1b62b0] focus:ring-2 focus:ring-[#1b62b0]/20 outline-hidden transition-all resize-none"
                  />
                </div>

                {/* Adjuntanos tu Curriculum */}
                <div>
                  <label
                    htmlFor="empleo-cv"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Adjuntanos tu Curriculum
                  </label>
                  <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-lg border border-dashed border-slate-300 bg-white">
                    <input
                      ref={fileInputRef}
                      id="empleo-cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="empleo-cv"
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-lg border border-slate-300 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 text-[#1b62b0]" />
                      <span>Seleccionar archivo</span>
                    </label>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-600 truncate">
                        {selectedFileName || 'Ningún archivo seleccionado'}
                      </span>
                    </div>
                    {selectedFileName && (
                      <button
                        type="button"
                        onClick={handleClearFile}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                        aria-label="Quitar archivo seleccionado"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Política de Privacidad */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-700">
                    <input
                      type="checkbox"
                      required
                      checked={formData.privacidadAceptada}
                      onChange={(e) =>
                        setFormData({ ...formData, privacidadAceptada: e.target.checked })
                      }
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1b62b0] focus:ring-[#1b62b0] cursor-pointer"
                    />
                    <span>He leído y acepto la Política de Privacidad.</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPrivacyModalOpen(true)}
                    className="text-xs text-[#1b62b0] hover:underline font-medium text-left cursor-pointer block"
                  >
                    Leer la Política de Privacidad antes de aceptarla
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
                  className="w-full bg-[#1b62b0] hover:bg-[#165194] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Enviando candidatura...' : 'Enviar candidatura'}</span>
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
                solicitud, almacenando el curriculum y/o candidatura, reservando el derecho a la
                inclusion del mismo en un proceso de seleccion de candidatos.
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
              <div className="w-9 h-9 rounded-lg bg-[#1b62b0]/10 text-[#1b62b0] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#1b62b0]">Política de Privacidad</h3>
            </div>

            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>
                De acuerdo con lo establecido en el Reglamento General de Protección de Datos (RGPD)
                y la Ley Orgánica de Protección de Datos Personales y garantía de los derechos
                digitales, te informamos sobre el tratamiento de los datos facilitados en tu
                candidatura:
              </p>
              <p>
                <strong>Responsable de los datos:</strong> URBA EQUIPOS MEDIOAMBIENTALES, S.L.
              </p>
              <p>
                <strong>Finalidad de los datos:</strong> Responder a la solicitud, almacenando el
                curriculum y/o candidatura, reservando el derecho a la inclusion del mismo en un
                proceso de seleccion de candidatos.
              </p>
              <p>
                <strong>Almacenamiento de los datos:</strong> Base de datos alojada en HOSTINET, S.L.
                (UE).
              </p>
              <p>
                <strong>Derechos:</strong> En cualquier momento puedes limitar, recuperar y borrar tu
                información enviando una solicitud a{' '}
                <a
                  href="mailto:seleccion@asecomtel.es"
                  className="text-[#1b62b0] font-semibold hover:underline"
                >
                  seleccion@asecomtel.es
                </a>{' '}
                o por correo postal a Calle San Luis, 46, 2ºB, 30730 San Javier (Murcia).
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, privacidadAceptada: true }));
                  setPrivacyModalOpen(false);
                }}
                className="bg-[#1b62b0] text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-[#165194] transition-colors cursor-pointer"
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
