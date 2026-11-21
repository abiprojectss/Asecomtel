import { Wifi, Cloud, Mail, PhoneCall, Wrench, Monitor, type LucideIcon } from 'lucide-react';
import Reveal from './Reveal';

interface ValueServiceItem {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}

const VALUE_SERVICES: ValueServiceItem[] = [
  {
    id: 'fibra',
    title: 'Fibra Óptica',
    description:
      'Muy útil para cámaras de vigilancia, servidores y otros dispositivos que requieren que nunca cambie la IP en su lugar de trabajo.',
    Icon: Wifi,
  },
  {
    id: 'office',
    title: 'Office 365 Essential',
    description:
      'Ofrecemos un paquete Office 365 completo, con almacenamiento en la nube incluido de 1 Tb y 50 Gb de almacenamiento en correo electrónico.',
    Icon: Cloud,
  },
  {
    id: 'fax',
    title: 'Fax to Mail',
    description:
      'Envía y recibe de forma sencilla y rápida Fax desde tu ordenador; solo deberás añadir el número de teléfono de destino en el asunto del correo, y recíbelo de la misma manera.',
    Icon: Mail,
  },
  {
    id: 'centralita',
    title: 'Centralita VOZ IP',
    description:
      'Centralitas IP con extensiones y grabación de llamadas.',
    Icon: PhoneCall,
  },
  {
    id: 'reparaciones',
    title: 'Reparaciones',
    description:
      'Ofrecemos un servicio de reparación de terminales exclusivo para nuestros clientes.',
    Icon: Wrench,
  },
  {
    id: 'web',
    title: 'Diseño Web',
    description:
      'Diseñamos tu web a medida de tu negocio.',
    Icon: Monitor,
  },
];

export default function ValueServicesShowcase() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#f7f7f7] border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b62b0] text-center mb-14 md:mb-16 tracking-tight">
            Servicios de valor añadido
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {VALUE_SERVICES.map(({ id, title, description, Icon }, idx) => (
            <Reveal
              key={id}
              delay={idx * 0.05}
              className="flex flex-col items-center text-center px-2"
            >
              <Icon
                className="w-11 h-11 text-[#1b62b0] mb-4"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1b62b0] mb-2.5 tracking-tight">
                {title}
              </h3>
              <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed max-w-xs">
                {description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
