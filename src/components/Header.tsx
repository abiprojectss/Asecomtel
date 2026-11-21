import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Inicio', to: '/', end: true },
  { label: 'Nosotros', to: '/nosotros', end: false },
  { label: 'Servicios', to: '/servicios', end: false },
  { label: 'Contactanos', to: '/contactanos', end: false },
  { label: 'Trabaja con nosotros', to: '/trabaja-con-nosotros', end: false },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Thin Top Bar */}
      <div className="bg-[#144a84] text-white/95 text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-center sm:justify-end gap-5 sm:gap-7">
          <a
            href="tel:968959545"
            title="968 959 545"
            className="inline-flex items-center gap-1.5 font-medium hover:text-white hover:underline underline-offset-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>Llamanos ahora</span>
          </a>
          <span className="text-white/30" aria-hidden="true">|</span>
          <a
            href="mailto:info@asecomtel.es"
            title="info@asecomtel.es"
            className="inline-flex items-center gap-1.5 font-medium hover:text-white hover:underline underline-offset-2 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>Envianos un correo electronico</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 text-2xl md:text-3xl font-extrabold tracking-tight text-[#1b62b0] hover:opacity-90 transition-opacity"
        >
          <span>Asecomtel</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `text-sm transition-colors pb-1 border-b-2 ${
                  isActive
                    ? 'text-[#1b62b0] font-semibold border-[#1b62b0]'
                    : 'text-slate-700 hover:text-[#1b62b0] font-medium border-transparent'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:text-[#1b62b0] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl">
          <nav className="flex flex-col space-y-2" aria-label="Navegación móvil">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-md text-base transition-colors ${
                    isActive
                      ? 'bg-[#1b62b0]/10 text-[#1b62b0] font-semibold'
                      : 'text-slate-800 hover:bg-slate-50 hover:text-[#1b62b0] font-medium'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
      </header>
    </>
  );
}
