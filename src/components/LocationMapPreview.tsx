import { MapPin, ExternalLink } from 'lucide-react';

const ADDRESS_QUERY = 'Calle San Luis, 46, 30730 San Javier, Murcia, Spain';
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS_QUERY
)}`;
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  ADDRESS_QUERY
)}&z=16&output=embed`;

export default function LocationMapPreview() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#EAF1FF] border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-[#00355F]" />
          <span>Ubicación · San Javier (Murcia)</span>
        </div>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#00355F] hover:underline"
        >
          <span>Abrir en Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Compact keyless map preview clickable to open Google Maps */}
      <div className="relative w-full h-[230px] sm:h-[250px] bg-slate-100">
        <iframe
          title="Mapa de ubicación de AsecomTel en San Javier (Murcia)"
          src={GOOGLE_MAPS_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full border-0 pointer-events-none select-none"
          tabIndex={-1}
        />

        {/* Transparent overlay link so clicking anywhere on the preview opens Google Maps */}
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir Calle San Luis, 46, 30730 San Javier (Murcia) en Google Maps"
          className="absolute inset-0 z-10 flex items-end justify-end p-3 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors"
        >
          <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-[#00355F] font-bold text-xs px-3 py-1.5 rounded-lg shadow-md border border-slate-200 group-hover:bg-[#00355F] group-hover:text-white group-hover:border-[#00355F] transition-colors">
            <span>Ver en Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      </div>
    </div>
  );
}
