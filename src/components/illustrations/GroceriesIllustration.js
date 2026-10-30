'use client';

import React from 'react';

export default function GroceriesIllustration({ className = 'w-32 h-32', animated = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id="kraftBagGrad" x1="40" y1="70" x2="120" y2="145" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E6C280" />
            <stop offset="0.6" stopColor="#D4A759" />
            <stop offset="1" stopColor="#B38638" />
          </linearGradient>
          <linearGradient id="bagFold" x1="40" y1="70" x2="120" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D4A759" />
            <stop offset="1" stopColor="#A6782E" />
          </linearGradient>
          <linearGradient id="carrotGrad" x1="72" y1="28" x2="98" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FB923C" />
            <stop offset="0.8" stopColor="#EA580C" />
            <stop offset="1" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="appleGrad" x1="42" y1="52" x2="68" y2="78" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EF4444" />
            <stop offset="0.8" stopColor="#DC2626" />
            <stop offset="1" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="breadGrad" x1="100" y1="20" x2="132" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" />
            <stop offset="0.5" stopColor="#D97706" />
            <stop offset="1" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="broccoliGrad" x1="40" y1="36" x2="66" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34D399" />
            <stop offset="0.6" stopColor="#10B981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Ambient Shadow */}
        <ellipse cx="80" cy="144" rx="42" ry="8" fill="#000000" fillOpacity="0.18" />

        {/* --- INGREDIENTS PEEKING OUT OF BAG --- */}

        {/* Crusty French Baguette (Right) */}
        <g transform="rotate(18 116 50)">
          <rect x="108" y="24" width="16" height="52" rx="8" fill="url(#breadGrad)" />
          {/* Bread score cuts */}
          <line x1="110" y1="32" x2="122" y2="36" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="110" y1="42" x2="122" y2="46" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="110" y1="52" x2="122" y2="56" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Fresh Crisp Broccoli / Greens (Left) */}
        <g>
          <circle cx="48" cy="50" r="13" fill="url(#broccoliGrad)" />
          <circle cx="60" cy="46" r="11" fill="#10B981" />
          <circle cx="56" cy="56" r="10" fill="#059669" />
          <circle cx="44" cy="56" r="8" fill="#047857" />
          {/* Leaf vein */}
          <path d="M52 48 Q56 42 62 44" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Big Farm Fresh Carrot (Center-Right) */}
        <g className={animated ? 'animate-sway' : ''}>
          {/* Green Carrot Leaf Tops */}
          <path
            d="M86 42 C84 28, 76 22, 70 20 C76 28, 80 34, 84 42 Z"
            fill="#10B981"
          />
          <path
            d="M87 40 C88 24, 94 16, 98 12 C96 22, 92 32, 88 40 Z"
            fill="#34D399"
          />
          <path
            d="M88 42 C92 28, 102 24, 108 22 C102 30, 96 36, 89 42 Z"
            fill="#059669"
          />
          {/* Carrot Root */}
          <path
            d="M78 44 C88 43, 94 45, 96 48 L87 82 C86 85, 83 85, 82 82 L76 48 C76 45, 77 44, 78 44 Z"
            fill="url(#carrotGrad)"
          />
          {/* Carrot ridges */}
          <line x1="80" y1="52" x2="88" y2="52" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="60" x2="90" y2="60" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="81" y1="68" x2="87" y2="68" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Shiny Red Apple (Front Left) */}
        <g>
          <ellipse cx="58" cy="74" rx="14" ry="13" fill="url(#appleGrad)" />
          {/* Apple Stem and Leaf */}
          <path d="M58 62 Q59 56 63 54" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="65" cy="56" rx="4" ry="2.5" fill="#34D399" transform="rotate(-20 65 56)" />
          {/* Glossy highlight */}
          <ellipse cx="53" cy="69" rx="3.5" ry="5.5" fill="#FFFFFF" fillOpacity="0.45" transform="rotate(-25 53 69)" />
        </g>

        {/* --- KRAFT GROCERY BAG BODY --- */}
        {/* Main bag */}
        <path
          d="M38 72 L122 72 L116 138 C116 141, 113 143, 110 143 L50 143 C47 143, 44 141, 44 138 L38 72 Z"
          fill="url(#kraftBagGrad)"
        />

        {/* Bag side fold / depth */}
        <path
          d="M38 72 L44 138 L54 141 L48 74 Z"
          fill="#B38638"
          fillOpacity="0.4"
        />

        {/* Zig-zag cut rim of paper bag */}
        <path
          d="M38 72 L43 68 L48 72 L53 68 L58 72 L63 68 L68 72 L73 68 L78 72 L83 68 L88 72 L93 68 L98 72 L103 68 L108 72 L113 68 L118 72 L122 72"
          stroke="url(#bagFold)"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Kraft Bag Crease Lines */}
        <path d="M50 82 L80 134 L110 82" stroke="#A6782E" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
        <line x1="80" y1="134" x2="80" y2="143" stroke="#A6782E" strokeWidth="1.5" opacity="0.6" />

        {/* BeeGo Leaf / Organic Stamp on the bag */}
        <g transform="translate(68, 96)">
          <rect x="0" y="0" width="24" height="24" rx="12" fill="#58111E" fillOpacity="0.15" />
          <path
            d="M6 14 C6 8, 12 6, 18 6 C18 12, 16 18, 10 18 C8 18, 6 16, 6 14 Z"
            fill="#58111E"
          />
          <path d="M8 16 L16 8" stroke="#FAF5EC" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Freshness Sparkles */}
        {animated && (
          <g className="animate-sparkle">
            <path
              d="M32 36 L34 40 L38 42 L34 44 L32 48 L30 44 L26 42 L30 40 Z"
              fill="#10B981"
            />
            <circle cx="128" cy="46" r="2.5" fill="#F59E0B" />
          </g>
        )}
      </svg>
    </div>
  );
}

