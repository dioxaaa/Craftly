import React from "react";

export type CraftlyLogoProps = {
  size?: "sm" | "lg";
};

export const CraftlyLogo: React.FC<CraftlyLogoProps> = ({ size = "sm" }) => {
  const heightClass = size === "lg" ? "h-12 sm:h-14" : "h-7 sm:h-10";

  return (
    <svg
      viewBox="0 0 228 66"
      className={`${heightClass} w-auto select-none overflow-visible`}
      role="img"
      aria-label="craftly."
    >
      {/* Looping dashed stitch thread wrapping gently around wordmark */}
      <path
        d="M 18 48 C 6 35, 16 12, 42 13 C 62 14, 72 8, 96 10"
        fill="none"
        stroke="#7C8B6A"
        strokeWidth="1.4"
        strokeDasharray="3.5 3.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M 176 47 C 194 52, 212 40, 208 24 C 204 12, 186 10, 174 16"
        fill="none"
        stroke="#D98A6C"
        strokeWidth="1.4"
        strokeDasharray="3 3.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Sewing needle at top-left */}
      <g transform="translate(8, 22) rotate(-32)">
        <line
          x1="0"
          y1="0"
          x2="20"
          y2="0"
          stroke="#4A3528"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <ellipse
          cx="2.5"
          cy="0"
          rx="2.1"
          ry="0.9"
          fill="#F9F6F0"
          stroke="#4A3528"
          strokeWidth="1.1"
        />
      </g>

      {/* Small yarn ball at bottom-left */}
      <g transform="translate(22, 52)">
        <circle
          cx="0"
          cy="0"
          r="6.2"
          fill="#E0A952"
          stroke="#4A3528"
          strokeWidth="1.4"
        />
        <path
          d="M -4.2 -2.2 Q 0 1 4.2 -2 M -3.5 2.5 Q 0 -1 3.8 2.2"
          fill="none"
          stroke="#4A3528"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>

      {/* Botanical leaves tucked near top-center */}
      <g transform="translate(132, 11) rotate(-14)">
        <path
          d="M 0 6 C -4 0, -2 -7, 4 -9 C 6 -3, 5 3, 0 6 Z"
          fill="#7C8B6A"
          stroke="#4A3528"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M 0 6 C 4 2, 10 0, 12 4 C 8 8, 4 8, 0 6 Z"
          fill="#94A480"
          stroke="#4A3528"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>

      {/* Miniature craft scissors at top-right */}
      <g transform="translate(184, 15) rotate(22)">
        <circle
          cx="0"
          cy="-3.2"
          r="2.8"
          fill="none"
          stroke="#4A3528"
          strokeWidth="1.4"
        />
        <circle
          cx="0"
          cy="3.2"
          r="2.8"
          fill="none"
          stroke="#4A3528"
          strokeWidth="1.4"
        />
        <line
          x1="2.4"
          y1="-2"
          x2="13"
          y2="2"
          stroke="#4A3528"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="2.4"
          y1="2"
          x2="13"
          y2="-2"
          stroke="#4A3528"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Folded origami paper boat at bottom-right */}
      <g transform="translate(196, 48)">
        <polygon
          points="-11,0 11,0 7,6 -7,6"
          fill="#F2EADF"
          stroke="#4A3528"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <polygon
          points="-6,0 0,-8 6,0"
          fill="#E0A952"
          stroke="#4A3528"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </g>

      {/* Handmade lowercase "craftly." lettering */}
      <text
        x="110"
        y="46"
        textAnchor="middle"
        fontFamily="Fredoka, ui-rounded, sans-serif"
        fontWeight="700"
        fontSize="37"
        letterSpacing="-0.5"
        fill="#D98A6C"
        stroke="#4A3528"
        strokeWidth="2.5"
        paintOrder="stroke fill"
        strokeLinejoin="round"
      >
        craftly.
      </text>
    </svg>
  );
};
