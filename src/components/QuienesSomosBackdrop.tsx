export default function QuienesSomosBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden flex items-center justify-center"
    >
      <svg
        viewBox="0 0 1200 440"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        className="w-full max-w-6xl h-full text-[#00355F] opacity-[0.12]"
      >
        <defs>
          <radialGradient id="quienes-somos-fade" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="78%" stopColor="white" stopOpacity="0.88" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </radialGradient>
          <mask id="quienes-somos-mask">
            <rect width="1200" height="440" fill="url(#quienes-somos-fade)" />
          </mask>
        </defs>

        <g mask="url(#quienes-somos-mask)" stroke="currentColor">
          {/* Three interlocking fine-line circles */}
          <circle cx="300" cy="220" r="175" strokeWidth="1.6" />
          <circle cx="600" cy="220" r="175" strokeWidth="1.6" />
          <circle cx="900" cy="220" r="175" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}
