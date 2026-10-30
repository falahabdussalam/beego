'use client';

import React from 'react';

export default function FoodIllustration({ className = 'w-32 h-32', animated = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id="foodBowlGrad" x1="20" y1="80" x2="140" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#58111E" />
            <stop offset="0.7" stopColor="#380611" />
            <stop offset="1" stopColor="#20040A" />
          </linearGradient>
          <linearGradient id="soupGrad" x1="30" y1="75" x2="130" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.6" stopColor="#D97706" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="noodleGrad" x1="40" y1="70" x2="120" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF3C7" />
            <stop offset="1" stopColor="#FDE68A" />
          </linearGradient>
          <linearGradient id="steamGrad" x1="80" y1="65" x2="80" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FAF5EC" stopOpacity="0.9" />
            <stop offset="0.6" stopColor="#FAF5EC" stopOpacity="0.4" />
            <stop offset="1" stopColor="#FAF5EC" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="eggYolk" cx="62" cy="80" r="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.7" stopColor="#EA580C" />
          </radialGradient>
        </defs>

        {/* Ambient Warm Shadow beneath bowl */}
        <ellipse cx="80" cy="144" rx="46" ry="9" fill="#000000" fillOpacity="0.18" />

        {/* Floating Steam Waves */}
        {animated && (
          <g>
            <path
              d="M65 62 C61 50, 70 42, 64 32 C60 25, 66 18, 63 12"
              stroke="url(#steamGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              className="animate-steam-1"
            />
            <path
              d="M82 60 C87 48, 79 38, 85 28 C89 20, 83 14, 85 8"
              stroke="url(#steamGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              className="animate-steam-2"
            />
            <path
              d="M98 63 C94 52, 102 44, 97 34 C93 27, 98 20, 96 14"
              stroke="url(#steamGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-steam-1"
              style={{ animationDelay: '0.8s' }}
            />
          </g>
        )}

        {/* Main Ceramic Bowl Body */}
        <path
          d="M24 74 C24 116, 52 138, 80 138 C108 138, 136 116, 136 74 C136 71, 133 68, 128 68 L32 68 C27 68, 24 71, 24 74 Z"
          fill="url(#foodBowlGrad)"
        />

        {/* Golden / Cream Decorative Pattern on Bowl */}
        <path
          d="M32 96 C46 118, 68 126, 80 126 C92 126, 114 118, 128 96"
          stroke="#E4D5BF"
          strokeWidth="2.5"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.6"
        />

        {/* Bowl Rim */}
        <ellipse cx="80" cy="72" rx="56" ry="11" fill="#7A162D" stroke="#E4D5BF" strokeWidth="2.5" />

        {/* Rich Curry / Ramen Soup Broth */}
        <ellipse cx="80" cy="74" rx="51" ry="8.5" fill="url(#soupGrad)" />

        {/* Steamy Noodles and Ingredients */}
        {/* Noodle swirls */}
        <path
          d="M48 73 Q60 67 76 74 T104 72 T118 75"
          stroke="url(#noodleGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M52 77 Q68 71 88 77 T114 74"
          stroke="url(#noodleGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Boiled Egg Half */}
        <ellipse cx="62" cy="76" rx="10" ry="6.5" fill="#FFFFFF" transform="rotate(-15 62 76)" />
        <ellipse cx="62" cy="76" rx="6" ry="4" fill="url(#eggYolk)" transform="rotate(-15 62 76)" />

        {/* Fresh Herb Leaves (coriander/scallion) */}
        <path
          d="M94 71 C96 68 100 68 103 71 C100 74 96 74 94 71 Z"
          fill="#10B981"
          className={animated ? 'animate-sway' : ''}
        />
        <path
          d="M98 74 C100 71 104 71 107 74 C104 77 100 77 98 74 Z"
          fill="#059669"
        />

        {/* Shiitake Mushroom slice */}
        <path
          d="M74 77 C77 73 85 73 88 77 C85 80 77 80 74 77 Z"
          fill="#78350F"
        />
        <path d="M81 74 L81 78" stroke="#FEF3C7" strokeWidth="1" strokeLinecap="round" />

        {/* Sleek Pair of Chopsticks resting across bowl */}
        <line x1="28" y1="62" x2="134" y2="69" stroke="#E4D5BF" strokeWidth="3" strokeLinecap="round" />
        <line x1="26" y1="58" x2="132" y2="65" stroke="#FAF5EC" strokeWidth="3" strokeLinecap="round" />
        <line x1="28" y1="62" x2="48" y2="63.5" stroke="#58111E" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="26" y1="58" x2="46" y2="59.5" stroke="#58111E" strokeWidth="3.5" strokeLinecap="round" />

        {/* Sparkle details */}
        {animated && (
          <g className="animate-sparkle">
            <path
              d="M126 42 L128 47 L133 49 L128 51 L126 56 L124 51 L119 49 L124 47 Z"
              fill="#F59E0B"
            />
            <circle cx="34" cy="48" r="2.5" fill="#FBBF24" />
          </g>
        )}
      </svg>
    </div>
  );
}

