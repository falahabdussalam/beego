'use client';

import React from 'react';

export default function MedicineIllustration({ className = 'w-32 h-32', animated = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id="bottleGrad" x1="42" y1="50" x2="108" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.4" stopColor="#0284C7" />
            <stop offset="1" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="capGrad" x1="56" y1="36" x2="94" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#E2E8F0" />
            <stop offset="1" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="capsuleGrad1" x1="0" y1="0" x2="28" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="capsuleGrad2" x1="0" y1="0" x2="28" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F43F5E" />
            <stop offset="1" stopColor="#E11D48" />
          </linearGradient>
          <radialGradient id="crossGlow" cx="75" cy="95" r="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="1" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="76" cy="144" rx="42" ry="8" fill="#000000" fillOpacity="0.18" />

        {/* Floating Blister Pack (Behind Bottle) */}
        <g transform="rotate(-12 40 85)">
          <rect x="22" y="55" width="42" height="64" rx="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          {/* 6 Foil pill bubbles */}
          <circle cx="34" cy="70" r="5.5" fill="#38BDF8" fillOpacity="0.35" stroke="#0284C7" strokeWidth="1" />
          <circle cx="52" cy="70" r="5.5" fill="#38BDF8" fillOpacity="0.35" stroke="#0284C7" strokeWidth="1" />
          <circle cx="34" cy="87" r="5.5" fill="#38BDF8" fillOpacity="0.35" stroke="#0284C7" strokeWidth="1" />
          <circle cx="52" cy="87" r="5.5" fill="#38BDF8" fillOpacity="0.35" stroke="#0284C7" strokeWidth="1" />
          <circle cx="34" cy="104" r="5.5" fill="#38BDF8" fillOpacity="0.35" stroke="#0284C7" strokeWidth="1" />
          <circle cx="52" cy="104" r="5.5" fill="#38BDF8" fillOpacity="0.35" stroke="#0284C7" strokeWidth="1" />
        </g>

        {/* Main Medicine Bottle */}
        <g>
          {/* Bottle Cap */}
          <rect x="58" y="38" width="36" height="15" rx="3" fill="url(#capGrad)" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="64" y1="41" x2="64" y2="50" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="70" y1="41" x2="70" y2="50" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="76" y1="41" x2="76" y2="50" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="41" x2="82" y2="50" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="88" y1="41" x2="88" y2="50" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Bottle Neck */}
          <path d="M64 53 L88 53 L92 62 L60 62 Z" fill="#0284C7" />

          {/* Bottle Body */}
          <rect x="48" y="62" width="56" height="76" rx="12" fill="url(#bottleGrad)" />

          {/* Glossy reflection on bottle */}
          <path
            d="M52 70 L52 130 C52 134, 55 136, 59 136 L61 136 C57 136, 55 134, 55 130 L55 70 C55 66, 57 64, 61 64 L59 64 C55 64, 52 66, 52 70 Z"
            fill="#FFFFFF"
            fillOpacity="0.4"
          />

          {/* White Medicine Label */}
          <rect x="52" y="74" width="48" height="52" rx="6" fill="#FAF5EC" />

          {/* Medical Cross Background Glow */}
          <circle cx="76" cy="98" r="18" fill="url(#crossGlow)" />

          {/* Pulsing Medical Cross (+) */}
          <g className={animated ? 'animate-heartbeat' : ''} style={{ transformOrigin: '76px 98px' }}>
            <rect x="72" y="88" width="8" height="20" rx="2" fill="#10B981" />
            <rect x="66" y="94" width="20" height="8" rx="2" fill="#10B981" />
            <circle cx="76" cy="98" r="3" fill="#FFFFFF" />
          </g>

          {/* Label lines */}
          <line x1="58" y1="80" x2="94" y2="80" stroke="#58111E" strokeWidth="2" strokeLinecap="round" />
          <line x1="58" y1="116" x2="78" y2="116" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="58" y1="121" x2="86" y2="121" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Floating Capsule Pill 1 (Emerald/White, Right) */}
        <g
          transform="translate(105, 46) rotate(32)"
          className={animated ? 'animate-float-gentle' : ''}
        >
          {/* Shadow */}
          <rect x="2" y="3" width="28" height="13" rx="6.5" fill="#000000" fillOpacity="0.2" />
          {/* Half Emerald */}
          <path d="M6.5 0 L14 0 L14 13 L6.5 13 C2.9 13, 0 10.1, 0 6.5 C0 2.9, 2.9 0, 6.5 0 Z" fill="url(#capsuleGrad1)" />
          {/* Half White */}
          <path d="M14 0 L21.5 0 C25.1 0, 28 2.9, 28 6.5 C28 10.1, 25.1 13, 21.5 13 L14 13 Z" fill="#FFFFFF" />
          {/* Shine band */}
          <ellipse cx="8" cy="4" rx="4" ry="1.5" fill="#FFFFFF" fillOpacity="0.6" />
        </g>

        {/* Floating Capsule Pill 2 (Rose/Yellow, Bottom Right) */}
        <g
          transform="translate(112, 98) rotate(-24)"
          className={animated ? 'animate-float-delayed' : ''}
        >
          <rect x="2" y="3" width="24" height="11" rx="5.5" fill="#000000" fillOpacity="0.18" />
          <path d="M5.5 0 L12 0 L12 11 L5.5 11 C2.5 11, 0 8.5, 0 5.5 C0 2.5, 2.5 0, 5.5 0 Z" fill="url(#capsuleGrad2)" />
          <path d="M12 0 L18.5 0 C21.5 0, 24 2.5, 24 5.5 C24 8.5, 21.5 11, 18.5 11 L12 11 Z" fill="#FEF08A" />
          <ellipse cx="6" cy="3" rx="3" ry="1.2" fill="#FFFFFF" fillOpacity="0.6" />
        </g>

        {/* Round Tablet (Bottom Left) */}
        <g transform="translate(28, 120)">
          <ellipse cx="10" cy="10" rx="9" ry="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="5" y1="8" x2="15" y2="12" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Sparkle & Vital Health Sparkles */}
        {animated && (
          <g className="animate-sparkle">
            <path
              d="M128 32 L130 36 L134 38 L130 40 L128 44 L126 40 L122 38 L126 36 Z"
              fill="#38BDF8"
            />
            <circle cx="36" cy="42" r="2.5" fill="#10B981" />
          </g>
        )}
      </svg>
    </div>
  );
}

