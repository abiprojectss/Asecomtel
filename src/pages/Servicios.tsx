import { Link } from 'react-router-dom';
import {
  Wifi,
  Smartphone,
  BadgeCheck,
  Handshake,
  PhoneCall,
  Shield,
  Mail,
  ArrowRight,
} from 'lucide-react';
import Reveal from '../components/Reveal';

const FEATURED_SERVICES = [
  {
    title: 'Servicio de Fibra Optica Simetrica de Yoigo',
    description:
      'Lograras una velocidad de trabajo superior y ademas misma velocidad tanto de subida como de bajada, la Fibra Optica de Yoigo es una de las mejores en el mercado.',
    Icon: Wifi,
  },
  {
    title: 'Telefonia Fija y Movil',
    description:
      'Te ofrecemos una amplia oferta en telefonia fija y movil de la mano de Yoigo.',
    Icon: Smartphone,
  },
];

const ADDITIONAL_SERVICES = [
  {
    title: 'Asesoramiento Gratuito',
    description:
      'Antes de realizar ningún cambio te asesoramos gratuitamente sobre que tarifa te conviene mas a la hora de pasarte a Yoigo, te aconsejaremos tambien en base a tu consumo para que consigas un precio unico en tu tarifa de Yoigo.',
    Icon: BadgeCheck,
    colSpan: 'lg:col-span-2',
  },
  {
    title: 'Acompañamiento en todo el proceso',
    description:
      'Te acompañamos en todo momento, desde que realizamos la solicitud de alta o portabilidad hasta la fase postventa, pasando por la instalacion de las lineas y el router. Nos aseguraremos que quedes contento con los cambios realizados.',
    Icon: Handshake,
    colSpan: 'lg:col-span-2',
  },
  {
    title: 'Centralitas VOZ IP',
    description:
      'Si tienes empresa con varios despachos, o varias sedes, te alegrara saber que tenemos la posibilidad de crearte centralitas virtuales, con mensajes de bienvenida, redirecciones, menu… o lo que elijas.',
    Icon: PhoneCall,
    colSpan: 'lg:col-span-2',
  },
  {
    title: 'IP Fija',
    description:
      '¿Camaras de Seguridad? Sin problema, te damos servicio de IP Fija para que puedas mantener la instalación de tus camaras y acceder en todo momento a ellas, estes donde estes.',
    Icon: Shield,
    colSpan: 'lg:col-span-3',
  },
  {
    title: 'Fax to Mail',
    description:
      'Envia Fax desde tu correo electronico, tan solo poniendo el numero de telefono de destino en el campo de destinatarios, recibelos en tu correo de la misma manera.',
    Icon: Mail,
    colSpan: 'lg:col-span-3',
  },
];

export default function Servicios() {
  return (
    <div className="bg-white">
      {/* Page Banner */}
      <section className="bg-[#00355F] text-white py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Conectividad empresarial, telefonía y soluciones a medida con la garantía de Yoigo y nuestro asesoramiento cercano.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#EAF1FF]">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Row 1: Flagship Yoigo Connectivity Cards */}
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURED_SERVICES.map(({ title, description, Icon }) => (
                <div
                  key={title}
                  className="bg-[#00355F] text-white p-7 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold mb-3 tracking-tight leading-snug">
                      {title}
                    </h2>
                    <p className="text-white/95 text-sm sm:text-base leading-relaxed">
                      {description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/15">
                    <Link
                      to="/contactanos"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline"
                    >
                      <span>Solicitar información</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Row 2 & 3: Advisory, Support & Specialized Services */}
          <Reveal delay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {ADDITIONAL_SERVICES.map(({ title, description, Icon, colSpan }) => (
                <div
                  key={title}
                  className={`bg-white border border-[#D2E4FF] rounded-xl p-6 sm:p-7 shadow-xs hover:border-[#00355F]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between ${colSpan}`}
                >
                  <div>
                    <div className="w-11 h-11 rounded-lg bg-[#EAF1FF] text-[#00355F] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#00355F] mb-3 tracking-tight leading-snug">
                      {title}
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Bottom CTA */}
          <Reveal delay={0.12}>
            <div className="mt-4 bg-[#00355F] text-white rounded-xl p-7 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
              <div className="space-y-1.5 max-w-2xl">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  ¿Necesitas asesoramiento personalizado para tu empresa?
                </h3>
                <p className="text-white/90 text-sm sm:text-base">
                  Estudiamos tu consumo actual de forma gratuita para ofrecerte la mejor tarifa de Yoigo y acompañarte en todo el proceso.
                </p>
              </div>
              <Link
                to="/contactanos"
                className="inline-flex items-center gap-2 bg-white text-[#00355F] font-bold text-sm sm:text-base px-6 py-3 rounded-lg hover:bg-[#EAF1FF] transition-colors shrink-0"
              >
                <span>Contáctanos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
