export default function CorporateTelecomBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1440 820"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full text-[#1b62b0] opacity-[0.11]"
      >
        <defs>
          <radialGradient id="telecom-backdrop-fade" cx="46%" cy="52%" r="58%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="68%" stopColor="white" stopOpacity="0.72" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="telecom-backdrop-mask">
            <rect width="1440" height="820" fill="url(#telecom-backdrop-fade)" />
          </mask>
        </defs>

        <g mask="url(#telecom-backdrop-mask)">
          {/* Subtle architectural drafting guides */}
          <g stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.45" strokeDasharray="4 6">
            <line x1="120" y1="740" x2="1120" y2="140" />
            <line x1="210" y1="810" x2="1240" y2="195" />
            <line x1="260" y1="70" x2="880" y2="790" />
            <line x1="480" y1="20" x2="1060" y2="740" />
          </g>

          {/* Main tilted isometric corporate & telecom tower */}
          <g transform="rotate(-24 620 450)">
            {/* Primary tower: left illuminated facade */}
            <polygon
              points="430,220 590,155 590,760 430,720"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            {/* Primary tower: right receding facade */}
            <polygon
              points="590,155 775,235 775,725 590,760"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            {/* Rooftop crown terrace */}
            <polygon
              points="430,220 590,155 775,235 615,290"
              stroke="currentColor"
              strokeWidth="1.15"
              strokeLinejoin="round"
            />
            {/* Upper penthouse / technical floor */}
            <polygon
              points="495,180 590,142 685,184 590,222"
              stroke="currentColor"
              strokeWidth="1.05"
              strokeLinejoin="round"
            />
            <line x1="495" y1="180" x2="495" y2="215" stroke="currentColor" strokeWidth="1" />
            <line x1="590" y1="142" x2="590" y2="176" stroke="currentColor" strokeWidth="1" />
            <line x1="685" y1="184" x2="685" y2="218" stroke="currentColor" strokeWidth="1" />

            {/* Vertical curtain-wall mullions — left facade */}
            {[0.2, 0.4, 0.6, 0.8].map((t) => {
              const x = 430 + (590 - 430) * t;
              const yTop = 220 + (155 - 220) * t;
              const yBot = 720 + (760 - 720) * t;
              return (
                <line
                  key={`lm-${t}`}
                  x1={x}
                  y1={yTop}
                  x2={x}
                  y2={yBot}
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeOpacity="0.65"
                />
              );
            })}

            {/* Vertical curtain-wall mullions — right facade */}
            {[0.2, 0.4, 0.6, 0.8].map((t) => {
              const x = 590 + (775 - 590) * t;
              const yTop = 155 + (235 - 155) * t;
              const yBot = 760 + (725 - 760) * t;
              return (
                <line
                  key={`rm-${t}`}
                  x1={x}
                  y1={yTop}
                  x2={x}
                  y2={yBot}
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeOpacity="0.65"
                />
              );
            })}

            {/* Horizontal floor slabs wrapping both facades */}
            {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((f) => {
              const lyLeft = 220 + (720 - 220) * f;
              const lyMid = 155 + (760 - 155) * f;
              const lyRight = 235 + (725 - 235) * f;
              return (
                <g key={`fl-${f}`} stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.7">
                  <line x1="430" y1={lyLeft} x2="590" y2={lyMid} />
                  <line x1="590" y1={lyMid} x2="775" y2={lyRight} />
                </g>
              );
            })}

            {/* Overshooting architectural CAD extension lines */}
            <g stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5">
              <line x1="590" y1="65" x2="590" y2="155" />
              <line x1="430" y1="165" x2="430" y2="220" />
              <line x1="775" y1="185" x2="775" y2="235" />
              <line x1="380" y1="240" x2="430" y2="220" />
              <line x1="775" y1="235" x2="835" y2="262" />
            </g>

            {/* Secondary foreground corporate wing */}
            <polygon
              points="290,395 430,340 430,745 290,715"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {[0.25, 0.5, 0.75].map((t) => {
              const x = 290 + (430 - 290) * t;
              const yTop = 395 + (340 - 395) * t;
              const yBot = 715 + (745 - 715) * t;
              return (
                <line
                  key={`swm-${t}`}
                  x1={x}
                  y1={yTop}
                  x2={x}
                  y2={yBot}
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.55"
                />
              );
            })}
            {[0.2, 0.4, 0.6, 0.8].map((f) => (
              <line
                key={`swf-${f}`}
                x1="290"
                y1={395 + (715 - 395) * f}
                x2="430"
                y2={340 + (745 - 340) * f}
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.6"
              />
            ))}

            {/* Right lower annex block */}
            <polygon
              points="775,375 910,430 910,755 775,725"
              stroke="currentColor"
              strokeWidth="1.05"
              strokeLinejoin="round"
            />
            {[0.25, 0.5, 0.75].map((t) => {
              const x = 775 + (910 - 775) * t;
              const yTop = 375 + (430 - 375) * t;
              const yBot = 725 + (755 - 725) * t;
              return (
                <line
                  key={`rwm-${t}`}
                  x1={x}
                  y1={yTop}
                  x2={x}
                  y2={yBot}
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeOpacity="0.5"
                />
              );
            })}
            {[0.25, 0.5, 0.75].map((f) => (
              <line
                key={`rwf-${f}`}
                x1="775"
                y1={375 + (725 - 375) * f}
                x2="910"
                y2={430 + (755 - 430) * f}
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.55"
              />
            ))}

            {/* Rooftop telecommunications spire & signal waves */}
            <g stroke="currentColor">
              <line x1="590" y1="142" x2="590" y2="55" strokeWidth="1.4" />
              <line x1="576" y1="86" x2="604" y2="86" strokeWidth="1" />
              <line x1="581" y1="104" x2="599" y2="104" strokeWidth="1" />
              <circle cx="590" cy="52" r="3.5" strokeWidth="1.2" fill="white" />
              <path
                d="M572 40C577 35 583 32 590 32C597 32 603 35 608 40"
                strokeWidth="1.05"
                strokeOpacity="0.75"
              />
              <path
                d="M558 29C567 21 578 16 590 16C602 16 613 21 622 29"
                strokeWidth="0.95"
                strokeOpacity="0.55"
              />
            </g>

            {/* Subtle technical nodes on structural intersections */}
            <g fill="white" stroke="currentColor" strokeWidth="1">
              <circle cx="590" cy="155" r="3" />
              <circle cx="430" cy="220" r="2.5" />
              <circle cx="775" cy="235" r="2.5" />
              <circle cx="290" cy="395" r="2.5" />
              <circle cx="910" cy="430" r="2.5" />
            </g>
          </g>

          {/* Subtle right-side geometric fiber/network horizon lines */}
          <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5">
            <path d="M980 260 L1140 260 L1210 190 L1370 190" />
            <path d="M1010 540 L1185 540 L1245 480 L1380 480" />
            <circle cx="1140" cy="260" r="3" fill="white" />
            <circle cx="1210" cy="190" r="3" fill="white" />
            <circle cx="1185" cy="540" r="3" fill="white" />
          </g>
        </g>
      </svg>
    </div>
  );
}
