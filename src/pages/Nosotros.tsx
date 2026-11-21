import { Link } from 'react-router-dom';
import { TrendingUp, Users, Compass, ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';

export default function Nosotros() {
  return (
    <div className="bg-white">
      {/* Page Banner */}
      <section className="bg-[#00355F] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Nosotros
          </h1>
        </Reveal>
      </section>

      {/* Main Content: 2 + 1 Editorial Grid */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#EAF1FF]">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Top Row: Nuestra Historia + Nuestro equipo y valores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Nuestra Historia */}
            <Reveal delay={0} className="h-full">
              <article className="h-full bg-white rounded-2xl border border-[#D2E4FF] p-8 sm:p-10 shadow-xs hover:shadow-md transition-shadow flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[#EAF1FF] text-[#00355F] flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#00355F] tracking-tight mb-4">
                  Nuestra Historia
                </h2>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                  A pesar de lo corto de nuestra historia, con solo un año de vida hemos logrado
                  crecer hasta convertirnos en un distribuidor a nivel nacional de referencia, todo
                  ello gracias a los integrantes de nuestro equipo y a nuestros clientes, que han
                  confiado en nosotros y seguimos trabajando para afianzar esa confianza.
                </p>
              </article>
            </Reveal>

            {/* Nuestro equipo y valores */}
            <Reveal delay={0.1} className="h-full">
              <article className="h-full bg-white rounded-2xl border border-[#D2E4FF] p-8 sm:p-10 shadow-xs hover:shadow-md transition-shadow flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[#EAF1FF] text-[#00355F] flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#00355F] tracking-tight mb-4">
                  Nuestro equipo y valores
                </h2>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                  Nuestro equipo es uno de los mas completos y mas diversos, cada uno es
                  especializado en su campo, y cada uno cuenta con voz propia y opinion en nuestra
                  empresa, por ello seguimos creciendo dia a dia y pensamos que esa es la formula del
                  exito para que sigamos dando nuestro mejor servicio y creciendo dia a dia.
                </p>
              </article>
            </Reveal>
          </div>

          {/* Bottom Featured Card: Nuestra misión */}
          <Reveal delay={0.15}>
            <article className="relative bg-white rounded-2xl border border-[#D2E4FF] p-8 sm:p-12 shadow-xs hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#00355F]" />

              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                <div className="w-14 h-14 rounded-xl bg-[#00355F] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Compass className="w-7 h-7" />
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#00355F] tracking-tight">
                    Nuestra misión
                  </h2>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                    Queremos ofrecer respuesta a la gran demanda que hay hoy en dia en asesoramiento
                    y distribución de Telecomunicaciones, sabemos que este sector puede ser algo
                    engorroso para el cliente final, por eso ademas de asesorar te acompañaremos en
                    todo el proceso de negociacion y de instalación, asi como tambien nos encargaremos
                    de reclamar por usted cualquier inconveniente que pudiese tener, tambien nos
                    ocupamos de ayudarle a renovar sus servicios y/o beneficios cuando estos esten
                    cerca de su caducidad sin ningun coste adicional, para ello contamos con un
                    extenso y profesional equipo comercial que se extiende a lo largo de todo el
                    territorio nacional.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.2} className="pt-6 text-center">
            <Link
              to="/contactanos"
              className="inline-flex items-center justify-center gap-2 bg-[#00355F] hover:bg-[#002645] text-white font-semibold px-8 py-3.5 rounded-lg shadow-md transition-all hover:shadow-lg active:scale-95"
            >
              <span>Contacta con nosotros</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
