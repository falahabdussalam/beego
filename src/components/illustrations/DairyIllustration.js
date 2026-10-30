'use client';

import React from 'react';

export default function DairyIllustration({ className = 'w-32 h-32', animated = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id="milkGlassGrad" x1="40" y1="40" x2="90" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8FAFC" />
            <stop offset="0.6" stopColor="#E2E8F0" />
            <stop offset="1" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="milkLiquidGrad" x1="45" y1="70" x2="85" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.8" stopColor="#F8FAFC" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="coffeeCupGrad" x1="90" y1="90" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#58111E" />
            <stop offset="1" stopColor="#380611" />
          </linearGradient>
          <linearGradient id="coffeeLiquidGrad" x1="95" y1="92" x2="135" y2="108" gradientUnits="userSpaceOnUse">
            <stop stopColor="#78350F" />
            <stop offset="1" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id="dairySteamGrad" x1="115" y1="85" x2="115" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FAF5EC" stopOpacity="0.85" />
            <stop offset="1" stopColor="#FAF5EC" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="80" cy="144" rx="46" ry="8" fill="#000000" fillOpacity="0.18" />

        {/* --- STEAM FROM COFFEE CUP --- */}
        {animated && (
          <g>
            <path
              d="M110 84 C107 74, 114 68, 110 58 C106 50, 112 44, 110 38"
              stroke="url(#dairySteamGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-steam-1"
            />
            <path
              d="M122 82 C126 72, 119 66, 124 56 C128 48, 122 42, 124 36"
              stroke="url(#dairySteamGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="animate-steam-2"
            />
          </g>
        )}

        {/* --- GLASS MILK BOTTLE (Left) --- */}
        <g>
          {/* Blue foil bottle cap */}
          <rect x="52" y="28" width="28" height="10" rx="3" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
          <ellipse cx="66" cy="28" rx="14" ry="4" fill="#38BDF8" />

          {/* Bottle Neck */}
          <path d="M56 38 L76 38 L84 62 L48 62 Z" fill="#E2E8F0" fillOpacity="0.5" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Bottle Body */}
          <rect x="42" y="62" width="48" height="76" rx="10" fill="url(#milkGlassGrad)" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Rich Fresh White Milk inside bottle */}
          <path
            d="M44 76 C52 74, 60 78, 68 75 C76 72, 82 76, 88 74 L88 132 C88 135, 85 137, 82 137 L50 137 C47 137, 44 135, 44 132 Z"
            fill="url(#milkLiquidGrad)"
          />

          {/* Measurement notches */}
          <line x1="46" y1="86" x2="54" y2="86" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="98" x2="58" y2="98" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="46" y1="110" x2="54" y2="110" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="122" x2="58" y2="122" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

          {/* Bottle Label with Pure Dairy Cow Stamp */}
          <rect x="54" y="92" width="28" height="26" rx="4" fill="#FAF5EC" stroke="#E4D5BF" strokeWidth="1" />
          <circle cx="68" cy="103" r="6" fill="#0284C7" fillOpacity="0.15" />
          {/* Milk droplet on label */}
          <path d="M68 98 C66 102, 64 104, 64 106 C64 108.2, 65.8 110, 68 110 C70.2 110, 72 108.2, 72 106 C72 104, 70 102, 68 98 Z" fill="#0284C7" />
          <text x="68" y="115" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#58111E" fontFamily="sans-serif">
            PURE
          </text>

          {/* Glass Glossy highlight */}
          <line x1="47" y1="68" x2="47" y2="130" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* --- COORG ROASTED COFFEE MUG (Right) --- */}
        <g>
          {/* Mug Handle */}
          <path
            d="M136 102 C146 102, 146 122, 136 122"
            stroke="#58111E"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mug Body */}
          <rect x="94" y="94" width="44" height="42" rx="8" fill="url(#coffeeCupGrad)" stroke="#7A162D" strokeWidth="1.5" />

          {/* Ceramic Rim & Fresh Coorg Coffee */}
          <ellipse cx="116" cy="94" rx="22" ry="7" fill="#7A162D" stroke="#E4D5BF" strokeWidth="1.5" />
          <ellipse cx="116" cy="95" rx="19" ry="5.5" fill="url(#coffeeLiquidGrad)" />

          {/* Coffee Foam Swirl */}
          <path
            d="M110 95 C113 93, 119 93, 122 96"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Golden Coffee Beans on the mug */}
          <g transform="translate(112, 110)">
            <ellipse cx="4" cy="4" rx="3.5" ry="4.5" fill="#E4D5BF" transform="rotate(25 4 4)" />
            <path d="M4 1 Q2 4 4 7" stroke="#58111E" strokeWidth="1" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* --- FLOATING MILK DROPLET --- */}
        {animated && (
          <g
            className="animate-drip"
            transform="translate(26, 78)"
          >
            <path
              d="M10 0 C6 7, 2 11, 2 15 C2 19.4, 5.6 23, 10 23 C14.4 23, 18 19.4, 18 15 C18 11, 14 7, 10 0 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <ellipse cx="7" cy="14" rx="2.5" ry="4" fill="#FFFFFF" fillOpacity="0.8" />
          </g>
        )}

        {/* Sparkles */}
        {animated && (
          <g className="animate-sparkle">
            <path
              d="M136 50 L138 54 L142 56 L138 58 L136 62 L134 58 L130 56 L134 54 Z"
              fill="#F59E0B"
            />
            <circle cx="38" cy="38" r="2.5" fill="#38BDF8" />
          </g>
        )}
      </svg>
    </div>
  );
}

