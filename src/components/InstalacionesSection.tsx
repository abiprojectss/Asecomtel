import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import Reveal from './Reveal';
import recepcionImg from '../assets/images/instalacion_recepcion_limpia_1794663449225.jpg';
import oficinaImg from '../assets/images/instalacion_oficina_1794663427765.jpg';
import tallerImg from '../assets/images/instalacion_taller_1794663429249.jpg';
import reunionesImg from '../assets/images/instalacion_reuniones_1794663428011.jpg';
import servidoresImg from '../assets/images/instalacion_servidores_1794663430809.jpg';

const FACILITY_PHOTOS = [
  {
    id: 1,
    src: recepcionImg,
    alt: 'Recepción de Asecomtel',
  },
  {
    id: 2,
    src: oficinaImg,
    alt: 'Oficinas comerciales de Asecomtel',
  },
  {
    id: 3,
    src: tallerImg,
    alt: 'Laboratorio técnico de reparaciones',
  },
  {
    id: 4,
    src: reunionesImg,
    alt: 'Sala de reuniones para empresas',
  },
  {
    id: 5,
    src: servidoresImg,
    alt: 'Infraestructura de red y servidores',
  },
];

export default function InstalacionesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end 55%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.35,
  });

  // Scroll down (0 -> 1) moves strip right (-35% -> -10%); scroll up moves strip left
  const x = useTransform(smoothProgress, [0, 1], ['-35%', '-10%']);

  const stripPhotos = [...FACILITY_PHOTOS, ...FACILITY_PHOTOS];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-slate-50 border-t border-slate-100 overflow-hidden"
    >
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b62b0] tracking-tight">
          Nuestras instalaciones
        </h2>
      </Reveal>

      {/* Scroll-driven horizontal gallery with spacing and soft rounded corners */}
      <div className="relative w-full overflow-hidden py-2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 sm:w-24 md:w-36 bg-gradient-to-r from-slate-50 via-slate-50/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 sm:w-24 md:w-36 bg-gradient-to-l from-slate-50 via-slate-50/75 to-transparent"
        />

        <motion.div
          style={{ x: prefersReducedMotion ? '-20%' : x }}
          className="flex w-max gap-5 sm:gap-6 md:gap-7 will-change-transform"
        >
          {stripPhotos.map((photo, idx) => (
            <div
              key={`${photo.id}-${idx}`}
              className="w-[250px] sm:w-[320px] md:w-[380px] shrink-0 aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                referrerPolicy="no-referrer"
                decoding="async"
                className="block w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
