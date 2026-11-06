import React from "react";

interface ChurchLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "rose" | "navy" | "gold" | "white";
  className?: string;
}

export const ChurchLogo: React.FC<ChurchLogoProps> = ({
  size = "md",
  variant = "rose",
  className = "",
}) => {
  const dimensions = {
    sm: "w-9 h-8",
    md: "w-12 h-11 sm:w-14 sm:h-12",
    lg: "w-16 h-14",
  }[size];

  const gradientId = `churchLogoGrad-${variant}-${size}`;

  const stops = {
    rose: ["#E11D74", "#A31555", "#75145E"],
    navy: ["#12549A", "#092D59", "#75145E"],
    gold: ["#FFE27A", "#FFC629", "#D48E00"],
    white: ["#FFFFFF", "#FFF5FA", "#FFD6EB"],
  }[variant];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${dimensions} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_6px_rgba(117,20,94,0.18)]"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stops[0]} />
            <stop offset="55%" stopColor={stops[1]} />
            <stop offset="100%" stopColor={stops[2]} />
          </linearGradient>
        </defs>

        {/* Central Bold Christian Cross rising from the Open Bible */}
        <path
          d="M54.5 6 H65.5 V22 H79.5 V31.5 H65.5 V62 H54.5 V31.5 H40.5 V22 H54.5 V6 Z"
          fill={`url(#${gradientId})`}
        />

        {/* Open Holy Bible Left Page */}
        <path
          d="M60 66 C48 56, 30 55, 16 61 L22 81 C35 76, 49 77, 60 85 Z"
          stroke={`url(#${gradientId})`}
          strokeWidth="4.5"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Open Holy Bible Right Page */}
        <path
          d="M60 66 C72 56, 90 55, 104 61 L98 81 C85 76, 71 77, 60 85 Z"
          stroke={`url(#${gradientId})`}
          strokeWidth="4.5"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Outer Book Cover Flanges */}
        <path
          d="M11 84 C29 79, 46 80, 60 88 C74 80, 91 79, 109 84"
          stroke={`url(#${gradientId})`}
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Base Foundation Line */}
        <line
          x1="8"
          y1="92"
          x2="112"
          y2="92"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
