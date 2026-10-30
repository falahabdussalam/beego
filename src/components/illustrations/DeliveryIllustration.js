'use client';

import React from 'react';

export default function DeliveryIllustration({ className = 'w-48 h-40', animated = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id="scooterBodyGrad" x1="50" y1="90" x2="160" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#58111E" />
            <stop offset="0.6" stopColor="#7A162D" />
            <stop offset="1" stopColor="#380611" />
          </linearGradient>
          <linearGradient id="boxGrad" x1="45" y1="65" x2="85" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#58111E" />
            <stop offset="1" stopColor="#20040A" />
          </linearGradient>
          <linearGradient id="headlightBeam" x1="165" y1="95" x2="200" y2="115" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" stopOpacity="0.6" />
            <stop offset="1" stopColor="#FEF08A" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="wheelHub" cx="0" cy="0" r="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#64748B" />
            <stop offset="0.6" stopColor="#334155" />
            <stop offset="1" stopColor="#0F172A" />
          </radialGradient>
        </defs>

        {/* --- ANIMATED ROAD SURFACE --- */}
        <line x1="10" y1="144" x2="190" y2="144" stroke="#7A162D" strokeWidth="2.5" opacity="0.4" />
        <line
          x1="15"
          y1="144"
          x2="185"
          y2="144"
          stroke="#FAF5EC"
          strokeWidth="2.5"
          className={animated ? 'animate-road' : ''}
        />

        {/* Ambient Ground Shadow under wheels */}
        <ellipse cx="64" cy="143" rx="18" ry="4" fill="#000000" fillOpacity="0.25" />
        <ellipse cx="146" cy="143" rx="18" ry="4" fill="#000000" fillOpacity="0.25" />

        {/* Speed wind trail lines (behind delivery box) */}
        {animated && (
          <g opacity="0.65">
            <path d="M12 78 L38 78" stroke="#E4D5BF" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
            <path d="M4 88 L32 88" stroke="#FAF5EC" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
            <path d="M16 98 L40 98" stroke="#E4D5BF" strokeWidth="2" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
          </g>
        )}

        {/* Headlight beam shining forward */}
        <polygon points="162,94 198,82 198,118 162,102" fill="url(#headlightBeam)" />

        {/* --- SCOOTER FRAME & CHASSIS --- */}
        {/* Rear swingarm & deck */}
        <path
          d="M64 126 L96 128 L146 126 L140 110 L100 112 L78 114 Z"
          fill="#334155"
        />
        {/* Footboard / Step-through Deck */}
        <rect x="94" y="118" width="34" height="8" rx="3" fill="#0F172A" stroke="#475569" strokeWidth="1" />

        {/* Front Apron & Steering Column */}
        <path
          d="M136 120 L154 90 L158 92 L144 124 Z"
          fill="url(#scooterBodyGrad)"
        />
        <path
          d="M148 94 C158 94, 166 98, 164 108 L152 116 L142 98 Z"
          fill="url(#scooterBodyGrad)"
        />

        {/* Headlight lamp */}
        <circle cx="162" cy="98" r="5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="162" cy="98" r="2.5" fill="#FFFFFF" />

        {/* Handlebars */}
        <path d="M148 84 L138 88" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="138" cy="88" r="3" fill="#0F172A" />

        {/* --- REAR WHEEL (Spinning) --- */}
        <g transform="translate(64, 126)">
          {/* Tyre */}
          <circle cx="0" cy="0" r="16" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <circle cx="0" cy="0" r="11" fill="#475569" />
          {/* Spinning Spokes */}
          <g className={animated ? 'animate-wheel' : ''}>
            <circle cx="0" cy="0" r="5" fill="#94A3B8" />
            <line x1="-11" y1="0" x2="11" y2="0" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="0" y1="-11" x2="0" y2="11" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="-8" y1="-8" x2="8" y2="8" stroke="#CBD5E1" strokeWidth="1.2" />
            <line x1="-8" y1="8" x2="8" y2="-8" stroke="#CBD5E1" strokeWidth="1.2" />
          </g>
        </g>

        {/* --- FRONT WHEEL (Spinning) --- */}
        <g transform="translate(146, 126)">
          <circle cx="0" cy="0" r="16" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <circle cx="0" cy="0" r="11" fill="#475569" />
          {/* Front Fork */}
          <line x1="-2" y1="-12" x2="4" y2="0" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <g className={animated ? 'animate-wheel' : ''}>
            <circle cx="0" cy="0" r="5" fill="#94A3B8" />
            <line x1="-11" y1="0" x2="11" y2="0" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="0" y1="-11" x2="0" y2="11" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="-8" y1="-8" x2="8" y2="8" stroke="#CBD5E1" strokeWidth="1.2" />
            <line x1="-8" y1="8" x2="8" y2="-8" stroke="#CBD5E1" strokeWidth="1.2" />
          </g>
        </g>

        {/* Mudguards */}
        <path d="M50 120 C52 110, 62 108, 76 112" stroke="#58111E" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M134 116 C138 108, 150 108, 158 116" stroke="#58111E" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* --- INSULATED BEEGO CARGO BOX (Rear Rack) --- */}
        <g transform="translate(42, 68)">
          <rect x="0" y="0" width="38" height="42" rx="6" fill="url(#boxGrad)" stroke="#7A162D" strokeWidth="2" />
          {/* Thermal Box Reflective Stripe */}
          <rect x="0" y="16" width="38" height="7" fill="#F59E0B" />
          {/* BeeGo Delivery Emblem */}
          <circle cx="19" cy="20" r="5.5" fill="#FAF5EC" />
          <text x="19" y="22.5" textAnchor="middle" fontSize="6" fontWeight="900" fill="#380611" fontFamily="sans-serif">
            🐝
          </text>
          <text x="19" y="34" textAnchor="middle" fontSize="5" fontWeight="900" fill="#FAF5EC" letterSpacing="0.5" fontFamily="sans-serif">
            BEEGO
          </text>
        </g>

        {/* --- DELIVERY RIDER (Casual, modern, fast) --- */}
        {/* Rider Body */}
        <path
          d="M102 78 L124 82 L116 114 L96 114 Z"
          fill="#380611"
        />
        {/* High-visibility vest / BeeGo jacket detail */}
        <path
          d="M104 80 L122 84 L118 102 L100 100 Z"
          fill="#58111E"
        />
        <line x1="108" y1="84" x2="106" y2="100" stroke="#F59E0B" strokeWidth="2" />
        <line x1="116" y1="86" x2="114" y2="101" stroke="#F59E0B" strokeWidth="2" />

        {/* Rider Arms holding handlebars */}
        <path
          d="M112 84 L134 88 L138 88"
          stroke="#58111E"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Rider Helmet with Visor */}
        <circle cx="116" cy="62" r="13" fill="#58111E" stroke="#7A162D" strokeWidth="1.5" />
        {/* Visor */}
        <path
          d="M122 58 C128 60, 128 68, 122 70"
          stroke="#38BDF8"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Helmet yellow accent line */}
        <path d="M106 58 C112 54, 122 54, 126 58" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Location Beacon Marker (Floating above rider) */}
        {animated && (
          <g
            className="animate-float-gentle"
            transform="translate(138, 30)"
          >
            <path
              d="M10 0 C4.5 0, 0 4.5, 0 10 C0 17.5, 10 26, 10 26 C10 26, 20 17.5, 20 10 C20 4.5, 15.5 0, 10 0 Z"
              fill="#10B981"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="10" r="4" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
}

