import React from "react";

export const WorkshopBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#F9F6F0]"
    >
      {/* Faint cutting-mat grid */}
      <svg className="h-full w-full opacity-[0.38]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="craftly-cutting-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#DDD3C2"
              strokeWidth="0.75"
            />
            <path
              d="M 24 0 L 24 48 M 0 24 L 48 24"
              fill="none"
              stroke="#E7DFD2"
              strokeWidth="0.45"
              strokeDasharray="2 4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#craftly-cutting-grid)" />
      </svg>

      {/* Top-left margin: torn paper swatch + wooden button */}
      <svg
        viewBox="0 0 180 220"
        className="absolute -left-6 top-20 hidden h-56 w-44 opacity-[0.22] md:block"
      >
        <path
          d="M 18 18 L 112 12 L 106 34 L 114 58 L 104 82 L 110 105 L 20 112 Z"
          fill="#E5D7C3"
          stroke="#4A3528"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M 32 42 L 88 38 M 32 58 L 76 55"
          stroke="#4A3528"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <g transform="translate(54, 160)">
          <circle cx="0" cy="0" r="18" fill="#D98A6C" stroke="#4A3528" strokeWidth="1.4" />
          <circle cx="0" cy="0" r="13" fill="none" stroke="#4A3528" strokeWidth="0.8" />
          <circle cx="-4" cy="-4" r="1.8" fill="#4A3528" />
          <circle cx="4" cy="-4" r="1.8" fill="#4A3528" />
          <circle cx="-4" cy="4" r="1.8" fill="#4A3528" />
          <circle cx="4" cy="4" r="1.8" fill="#4A3528" />
        </g>
      </svg>

      {/* Top-right margin: wooden ruler markings + pressed botanical leaf */}
      <svg
        viewBox="0 0 200 260"
        className="absolute -right-6 top-24 hidden h-64 w-48 opacity-[0.22] md:block"
      >
        <g transform="translate(120, 14) rotate(12)">
          <rect
            x="0"
            y="0"
            width="42"
            height="170"
            rx="4"
            fill="#E0A952"
            stroke="#4A3528"
            strokeWidth="1.3"
          />
          {[18, 34, 50, 66, 82, 98, 114, 130, 146].map((y, idx) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2={idx % 2 === 0 ? "16" : "10"}
              y2={y}
              stroke="#4A3528"
              strokeWidth="1.2"
            />
          ))}
        </g>
        <g transform="translate(65, 195) rotate(-18)">
          <path
            d="M 0 36 C -16 14, -10 -12, 12 -24 C 24 -4, 18 20, 0 36 Z"
            fill="#7C8B6A"
            stroke="#4A3528"
            strokeWidth="1.3"
          />
          <path d="M 0 36 L 9 -18" stroke="#4A3528" strokeWidth="1.1" />
        </g>
      </svg>

      {/* Bottom-left margin: thread spool + dashed stitch trail */}
      <svg
        viewBox="0 0 210 210"
        className="absolute -left-4 bottom-8 hidden h-52 w-52 opacity-[0.2] lg:block"
      >
        <path
          d="M 16 40 C 55 25, 84 82, 135 64 C 165 53, 185 88, 175 130"
          fill="none"
          stroke="#4A3528"
          strokeWidth="1.4"
          strokeDasharray="5 5"
        />
        <g transform="translate(56, 132) rotate(-10)">
          <rect x="-20" y="-26" width="40" height="8" rx="3" fill="#C7A67B" stroke="#4A3528" strokeWidth="1.3" />
          <rect x="-15" y="-18" width="30" height="36" fill="#D98A6C" stroke="#4A3528" strokeWidth="1.3" />
          <rect x="-20" y="18" width="40" height="8" rx="3" fill="#C7A67B" stroke="#4A3528" strokeWidth="1.3" />
          <line x1="-15" y1="-6" x2="15" y2="-6" stroke="#4A3528" strokeWidth="0.9" />
          <line x1="-15" y1="6" x2="15" y2="6" stroke="#4A3528" strokeWidth="0.9" />
        </g>
      </svg>

      {/* Bottom-right margin: drafting compass + craft scissors */}
      <svg
        viewBox="0 0 220 220"
        className="absolute -right-4 bottom-6 hidden h-56 w-56 opacity-[0.2] lg:block"
      >
        <g transform="translate(120, 95) rotate(-14)">
          <circle cx="0" cy="-42" r="7" fill="#E0A952" stroke="#4A3528" strokeWidth="1.4" />
          <line x1="-3" y1="-36" x2="-24" y2="38" stroke="#4A3528" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="3" y1="-36" x2="24" y2="38" stroke="#4A3528" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M -14 6 Q 0 14 14 6" fill="none" stroke="#4A3528" strokeWidth="1.2" />
        </g>
        <g transform="translate(58, 160) rotate(28)">
          <circle cx="-8" cy="0" r="8" fill="none" stroke="#4A3528" strokeWidth="1.4" />
          <circle cx="8" cy="0" r="8" fill="none" stroke="#4A3528" strokeWidth="1.4" />
          <line x1="-4" y1="-6" x2="10" y2="-38" stroke="#4A3528" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="4" y1="-6" x2="-10" y2="-38" stroke="#4A3528" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
