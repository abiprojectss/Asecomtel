import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, X } from 'lucide-react';

export default function Footer() {
  const [legalModalContent, setLegalModalContent] = useState<string | null>(null);

  return (
    <>
      <footer className="bg-[#00355F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {/* Column 1: Asecomtel & Address */}
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-6">
                Asecomtel
              </h3>
              <ul className="space-y-4 text-white/95 text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1.5 font-bold text-lg leading-none">•</span>
                  <span>C/ San Luis, 46 – 2ºB. 30730 San Javier (Murcia)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1.5 font-bold text-lg leading-none">•</span>
                  <div>
                    <span>Telefonos de contacto: </span>
                    <a
                      href="tel:968959545"
                      className="font-semibold underline underline-offset-2 hover:text-[#EAF1FF] transition-colors"
                    >
                      968 959 545
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white mt-1.5 font-bold text-lg leading-none">•</span>
                  <div>
                    <span>E-MAIL: </span>
                    <a
                      href="mailto:info@asecomtel.es"
                      className="font-semibold underline underline-offset-2 hover:text-[#EAF1FF] transition-colors"
                    >
                      info@asecomtel.es
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2: Enlaces rápidos */}
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-6">
                Enlaces rápidos
              </h3>
              <ul className="space-y-3 text-white/95 text-base font-normal">
                <li>
                  <Link
                    to="/trabaja-con-nosotros"
                    className="hover:underline hover:text-white transition-colors"
                  >
                    Trabaja con nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contactanos"
                    className="hover:underline hover:text-white transition-colors"
                  >
                    Contactanos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/nosotros"
                    className="hover:underline hover:text-white transition-colors"
                  >
                    Sobre Nosotros
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Redes */}
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-6">
                Redes
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="bg-[#00203a] border-t border-white/10 text-white/90 py-5 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p>Copyright © 2020 Asecomtel. Todos los derechos reservados</p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-white/90">
              <button
                type="button"
                onClick={() => setLegalModalContent('Aviso Legal')}
                className="hover:underline hover:text-white transition-colors cursor-pointer"
              >
                Aviso Legal
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setLegalModalContent('Política de cookies')}
                className="hover:underline hover:text-white transition-colors cursor-pointer"
              >
                Política de cookies
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setLegalModalContent('Política de privacidad')}
                className="hover:underline hover:text-white transition-colors cursor-pointer"
              >
                Política de privacidad
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* LEGAL MODAL */}
      {legalModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-100 max-h-[80vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setLegalModalContent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Cerrar modal legal"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-[#00355F] mb-4">{legalModalContent}</h3>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>
                <strong>Asecomtel</strong> cumple íntegramente con la legislación vigente en materia
                de protección de datos personales y con los deberes de confidencialidad propios de
                su actividad como distribuidor de soluciones de telecomunicaciones para empresas.
              </p>
              <p>
                <strong>Datos de contacto del responsable:</strong>
                <br />
                Asecomtel
                <br />
                C/ San Luis, 46 – 2ºB. 30730 San Javier (Murcia)
                <br />
                Teléfono: 968 959 545 | Email: info@asecomtel.es
              </p>
              <p>
                Para cualquier ejercicio de derechos de acceso, rectificación, cancelación u
                oposición, puede dirigirse por escrito a la dirección postal indicada o a través de
                nuestro correo electrónico oficial.
              </p>
            </div>
            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={() => setLegalModalContent(null)}
                className="bg-[#00355F] text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-[#002645] transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
