import React from "react";
import type { StepActionType } from "../types/invention";

interface StepIllustrationProps {
  actionType: StepActionType;
  caption: string;
}

export const StepIllustration: React.FC<StepIllustrationProps> = ({
  actionType,
  caption,
}) => {
  return (
    <figure className="w-full shrink-0 rounded-xl border border-[#D8CFC0] bg-[#FFFDF9] p-2.5 sm:w-44">
      <svg
        viewBox="0 0 160 108"
        className="h-24 w-full"
        role="img"
        aria-label={caption}
      >
        <rect x="0" y="0" width="160" height="108" rx="8" fill="#F9F6F0" />

        {actionType === "measure" && (
          <g>
            {/* Isometric part slab */}
            <polygon
              points="26,64 102,42 134,58 58,80"
              fill="#F2EADF"
              stroke="#4A3528"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Wooden ruler overlay */}
            <g transform="translate(36, 26) rotate(14)">
              <rect
                x="0"
                y="0"
                width="92"
                height="18"
                rx="2"
                fill="#E0A952"
                stroke="#4A3528"
                strokeWidth="1.5"
              />
              {[12, 24, 36, 48, 60, 72, 84].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2={x % 24 === 0 ? "8" : "5"}
                  stroke="#4A3528"
                  strokeWidth="1.2"
                />
              ))}
            </g>
            {/* Dashed mark line */}
            <line
              x1="60"
              y1="54"
              x2="92"
              y2="70"
              stroke="#D98A6C"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          </g>
        )}

        {actionType === "cut" && (
          <g>
            <polygon
              points="24,68 96,42 132,58 60,84"
              fill="#F2EADF"
              stroke="#4A3528"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <line
              x1="58"
              y1="55"
              x2="94"
              y2="72"
              stroke="#D98A6C"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Scissors */}
            <g transform="translate(86, 30) rotate(-22)">
              <circle cx="-6" cy="-6" r="6" fill="none" stroke="#4A3528" strokeWidth="1.8" />
              <circle cx="6" cy="-6" r="6" fill="none" stroke="#4A3528" strokeWidth="1.8" />
              <line x1="-2" y1="-1" x2="8" y2="24" stroke="#4A3528" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="2" y1="-1" x2="-8" y2="24" stroke="#D98A6C" strokeWidth="2.2" strokeLinecap="round" />
            </g>
            {/* Direction arrow */}
            <path
              d="M 102 66 L 122 50"
              fill="none"
              stroke="#7C8B6A"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <polygon points="124,48 115,50 120,56" fill="#7C8B6A" />
          </g>
        )}

        {actionType === "puncture" && (
          <g>
            <ellipse
              cx="80"
              cy="72"
              rx="48"
              ry="16"
              fill="#F2EADF"
              stroke="#4A3528"
              strokeWidth="1.6"
            />
            <circle cx="62" cy="70" r="4" fill="#4A3528" />
            <circle cx="98" cy="70" r="4" fill="#4A3528" />
            {/* Awl / punch tool */}
            <g transform="translate(80, 22)">
              <rect x="-7" y="0" width="14" height="18" rx="4" fill="#D98A6C" stroke="#4A3528" strokeWidth="1.5" />
              <polygon points="-2,18 2,18 0,38" fill="#4A3528" />
            </g>
            <path d="M 80 62 L 80 68" stroke="#D98A6C" strokeWidth="2" strokeDasharray="2 2" />
          </g>
        )}

        {actionType === "fold" && (
          <g>
            <polygon
              points="28,74 78,56 78,24 28,42"
              fill="#E7DAC6"
              stroke="#4A3528"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <polygon
              points="78,56 130,72 130,40 78,24"
              fill="#F2EADF"
              stroke="#4A3528"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <line
              x1="78"
              y1="24"
              x2="78"
              y2="56"
              stroke="#D98A6C"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            {/* Fold arc arrow */}
            <path
              d="M 52 24 Q 78 10 104 24"
              fill="none"
              stroke="#7C8B6A"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <polygon points="107,26 98,25 103,19" fill="#7C8B6A" />
          </g>
        )}

        {actionType === "thread" && (
          <g>
            {/* Ring collar */}
            <ellipse
              cx="80"
              cy="64"
              rx="38"
              ry="14"
              fill="none"
              stroke="#4A3528"
              strokeWidth="4"
            />
            <ellipse
              cx="80"
              cy="64"
              rx="38"
              ry="14"
              fill="none"
              stroke="#E0A952"
              strokeWidth="1.6"
            />
            {/* Cord path threading through */}
            <path
              d="M 32 32 C 50 26, 62 56, 80 64 C 98 72, 114 38, 132 34"
              fill="none"
              stroke="#D98A6C"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <circle cx="80" cy="64" r="3.5" fill="#7C8B6A" />
          </g>
        )}

        {actionType === "join" && (
          <g>
            {/* Left block */}
            <rect
              x="28"
              y="44"
              width="42"
              height="34"
              rx="4"
              fill="#F2EADF"
              stroke="#4A3528"
              strokeWidth="1.6"
            />
            {/* Right block */}
            <rect
              x="90"
              y="44"
              width="42"
              height="34"
              rx="4"
              fill="#D98A6C"
              stroke="#4A3528"
              strokeWidth="1.6"
            />
            {/* Converging assembly arrows */}
            <path d="M 73 61 L 87 61" stroke="#7C8B6A" strokeWidth="2.2" />
            <polygon points="88,61 81,57 81,65" fill="#7C8B6A" />
            <polygon points="72,61 79,57 79,65" fill="#7C8B6A" />
          </g>
        )}

        {actionType === "mount" && (
          <g>
            {/* Base plinth */}
            <polygon
              points="30,78 80,60 130,78 80,94"
              fill="#E0A952"
              stroke="#4A3528"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {/* Upper module descending */}
            <rect
              x="56"
              y="22"
              width="48"
              height="32"
              rx="5"
              fill="#7C8B6A"
              stroke="#4A3528"
              strokeWidth="1.6"
            />
            <line
              x1="80"
              y1="56"
              x2="80"
              y2="72"
              stroke="#D98A6C"
              strokeWidth="2.2"
              strokeDasharray="3 2"
            />
            <polygon points="80,76 75,68 85,68" fill="#D98A6C" />
          </g>
        )}

        {actionType === "finish" && (
          <g>
            <rect
              x="30"
              y="48"
              width="98"
              height="30"
              rx="5"
              fill="#F2EADF"
              stroke="#4A3528"
              strokeWidth="1.6"
            />
            {/* Sanding block / brush */}
            <g transform="translate(66, 26) rotate(-10)">
              <rect
                x="0"
                y="0"
                width="36"
                height="16"
                rx="3"
                fill="#D98A6C"
                stroke="#4A3528"
                strokeWidth="1.5"
              />
            </g>
            <path
              d="M 48 40 L 112 40"
              stroke="#7C8B6A"
              strokeWidth="1.8"
              strokeDasharray="4 3"
            />
          </g>
        )}

        {actionType === "test" && (
          <g>
            {/* Level & Check */}
            <rect
              x="32"
              y="56"
              width="96"
              height="20"
              rx="6"
              fill="#F2EADF"
              stroke="#4A3528"
              strokeWidth="1.6"
            />
            <circle cx="80" cy="66" r="6" fill="#7C8B6A" stroke="#4A3528" strokeWidth="1.3" />
            <path
              d="M 64 36 L 75 46 L 98 24"
              fill="none"
              stroke="#7C8B6A"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
      <figcaption className="mt-1.5 text-center text-[11px] font-medium leading-snug text-[#4A3528]/80 break-words">
        {caption}
      </figcaption>
    </figure>
  );
};
