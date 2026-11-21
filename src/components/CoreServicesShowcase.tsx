import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

type CoreServiceId = 'fibra' | 'telefonia' | 'ip' | 'centralita';

interface CoreServiceItem {
  id: CoreServiceId;
  num: string;
  title: string;
  description: string;
}

const CORE_SERVICES: CoreServiceItem[] = [
  {
    id: 'fibra',
    num: '01',
    title: 'Fibra Óptica',
    description:
      'Conectividad de alta velocidad y máxima estabilidad para garantizar el funcionamiento continuo de tu empresa.',
  },
  {
    id: 'telefonia',
    num: '02',
    title: 'Telefonía fija y móvil',
    description:
      'Soluciones convergentes de voz y datos adaptadas a las comunicaciones y necesidades de tu equipo de trabajo.',
  },
  {
    id: 'ip',
    num: '03',
    title: 'IP fija',
    description:
      'Dirección IP fija para servidores, accesos remotos seguros, redes virtuales y sistemas de videovigilancia.',
  },
  {
    id: 'centralita',
    num: '04',
    title: 'Centralita virtual',
    description:
      'Gestión avanzada e inteligente de llamadas con extensiones, locuciones y desvíos flexibles.',
  },
];

function AnimatedCoreServiceIcon({ id }: { id: CoreServiceId }) {
  switch (id) {
    case 'fibra':
      return (
        <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 text-[#00355F]" fill="none">
          <motion.circle
            cx="60"
            cy="84"
            r="8"
            fill="white"
            stroke="currentColor"
            strokeWidth="4.5"
            animate={{ scale: [1, 1.22, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M42 68C46.8 63.2 53.1 60.5 60 60.5C66.9 60.5 73.2 63.2 78 68"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            animate={{ opacity: [0.35, 1, 0.35], scale: [0.96, 1.03, 0.96] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            style={{ transformOrigin: '60px 84px' }}
          />
          <motion.path
            d="M28 53C36.6 44.4 47.8 39.5 60 39.5C72.2 39.5 83.4 44.4 92 53"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.96, 1.03, 0.96] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{ transformOrigin: '60px 84px' }}
          />
          <motion.path
            d="M15 38C27 26 42.7 19.5 60 19.5C77.3 19.5 93 26 105 38"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            animate={{ opacity: [0.2, 0.95, 0.2], scale: [0.97, 1.03, 0.97] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ transformOrigin: '60px 84px' }}
          />
        </svg>
      );

    case 'telefonia':
      return (
        <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 text-[#00355F]" fill="none">
          {/* Desktop / Landline base & handset on the left */}
          <rect
            x="20"
            y="42"
            width="46"
            height="54"
            rx="8"
            fill="white"
            stroke="currentColor"
            strokeWidth="4.2"
          />
          <rect
            x="28"
            y="50"
            width="30"
            height="16"
            rx="3"
            fill="white"
            stroke="currentColor"
            strokeWidth="3.2"
          />
          <circle cx="33" cy="76" r="2.5" fill="currentColor" />
          <circle cx="43" cy="76" r="2.5" fill="currentColor" />
          <circle cx="53" cy="76" r="2.5" fill="currentColor" />
          <circle cx="33" cy="86" r="2.5" fill="currentColor" />
          <circle cx="43" cy="86" r="2.5" fill="currentColor" />
          <circle cx="53" cy="86" r="2.5" fill="currentColor" />

          {/* Mobile phone overlapping on the right */}
          <motion.g
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect
              x="58"
              y="26"
              width="40"
              height="68"
              rx="8"
              fill="white"
              stroke="currentColor"
              strokeWidth="4.2"
            />
            <line
              x1="72"
              y1="35"
              x2="84"
              y2="35"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <motion.path
              d="M68 54H88M68 64H82"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx="78" cy="83" r="3" fill="white" stroke="currentColor" strokeWidth="2.8" />
          </motion.g>

          {/* Subtle signal arc above */}
          <motion.path
            d="M70 18C74 14 82 14 86 18"
            stroke="currentColor"
            strokeWidth="3.8"
            strokeLinecap="round"
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.94, 1.05, 0.94] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '78px 20px' }}
          />
        </svg>
      );

    case 'ip':
      return (
        <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 text-[#00355F]" fill="none">
          <motion.path
            d="M60 18L94 31V57C94 78.5 79.4 95.5 60 102C40.6 95.5 26 78.5 26 57V31L60 18Z"
            fill="white"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinejoin="round"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '60px 60px' }}
          />
          {/* Padlock / Fixed Anchor inside shield */}
          <motion.g
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M49 56V49C49 42.9 53.9 38 60 38C66.1 38 71 42.9 71 49V56"
              stroke="currentColor"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            <rect
              x="43"
              y="56"
              width="34"
              height="24"
              rx="5"
              fill="white"
              stroke="currentColor"
              strokeWidth="4.2"
            />
            <motion.circle
              cx="60"
              cy="68"
              r="3.5"
              fill="white"
              stroke="currentColor"
              strokeWidth="3"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.g>
        </svg>
      );

    case 'centralita':
      return (
        <svg viewBox="0 0 120 120" className="w-28 h-28 sm:w-32 sm:h-32 text-[#00355F]" fill="none">
          <motion.g
            animate={{ rotate: [-6, 6, -6, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
            style={{ transformOrigin: '48px 70px' }}
          >
            <path
              d="M31 37C31 33.7 33.7 31 37 31H45.2C47.7 31 49.9 32.7 50.6 35.1L53.3 44.8C53.9 46.9 53.1 49.1 51.3 50.4L45.8 54.4C49.5 62.3 55.7 68.5 63.6 72.2L67.6 66.7C68.9 64.9 71.1 64.1 73.2 64.7L82.9 67.4C85.3 68.1 87 70.3 87 72.8V81C87 84.3 84.3 87 81 87C53.4 87 31 64.6 31 37Z"
              fill="white"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
          </motion.g>
          <motion.path
            d="M66 42C72.6 42 78 47.4 78 54"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.92, 1.06, 0.92] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '66px 54px' }}
          />
          <motion.path
            d="M66 28C80.4 28 92 39.6 92 54"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            animate={{ opacity: [0.2, 0.95, 0.2], scale: [0.94, 1.05, 0.94] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
            style={{ transformOrigin: '66px 54px' }}
          />
        </svg>
      );
  }
}

export default function CoreServicesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = CORE_SERVICES[activeIndex];

  return (
    <section className="relative z-10 pb-20 md:pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Animated Icon Stage + Floating Description Box */}
          <Reveal className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#EAF1FF] border border-[#D2E4FF] shadow-md min-h-[380px] sm:min-h-[430px] flex flex-col justify-between p-5 sm:p-7">
              {/* Center Animated Icon */}
              <div className="relative z-10 flex-1 flex items-center justify-center py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id}
                    initial={{ opacity: 0, scale: 0.86, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex items-center justify-center"
                  >
                    <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-white shadow-md flex items-center justify-center">
                      <AnimatedCoreServiceIcon id={activeService.id} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Description Card */}
              <div className="relative z-10 bg-white border border-[#D2E4FF] rounded-xl p-5 shadow-xs">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#00355F]">
                      {activeService.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {activeService.description}
                    </p>
                    <div className="pt-1">
                      <Link
                        to="/contactanos"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00355F] hover:text-[#002645] hover:underline transition-colors"
                      >
                        <span>Solicitar información</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* Right: Interactive Numbered Service Selector */}
          <Reveal delay={0.08} className="lg:col-span-6">
            <div
              role="tablist"
              aria-label="Servicios principales"
              className="border-t border-[#00355F]/35 divide-y divide-slate-200"
            >
              {CORE_SERVICES.map((service, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveIndex(idx)}
                    className={`group w-full flex items-center justify-between gap-4 py-6 sm:py-7 px-3 text-left transition-colors cursor-pointer ${
                      isActive ? 'bg-[#EAF1FF]' : 'hover:bg-[#EAF1FF]/55'
                    }`}
                  >
                    <div className="flex items-baseline gap-4 sm:gap-5 min-w-0">
                      <span
                        className={`text-xs sm:text-sm font-bold tabular-nums shrink-0 transition-colors ${
                          isActive ? 'text-[#00355F]' : 'text-slate-400 group-hover:text-[#00355F]/75'
                        }`}
                      >
                        {service.num}
                      </span>
                      <span
                        className={`font-display text-lg sm:text-2xl font-semibold tracking-tight transition-colors ${
                          isActive
                            ? 'text-[#00355F]'
                            : 'text-slate-900 group-hover:text-[#00355F]'
                        }`}
                      >
                        {service.title}
                      </span>
                    </div>

                    <span
                      className={`shrink-0 flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? 'w-9 h-9 rounded-full bg-[#00355F] text-white shadow-sm'
                          : 'w-9 h-9 text-slate-500 group-hover:text-[#00355F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                      }`}
                    >
                      {isActive ? (
                        <ArrowRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
