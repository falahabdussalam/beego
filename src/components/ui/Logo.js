import React from 'react';
import Link from 'next/link';

export default function Logo({ showTagline = true, size = 'default', href = '/' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const content = (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Custom Bee Emblem */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md shadow-amber-500/20 text-slate-950 font-black tracking-tighter ${
        isLarge ? 'w-12 h-12 text-2xl' : isSmall ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl'
      }`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isLarge ? 'w-7 h-7' : isSmall ? 'w-5 h-5' : 'w-6 h-6'}
        >
          {/* Stylized Bee Stripes & Wing Shape */}
          <path
            d="M8 12C8 9.79086 9.79086 8 12 8H19C21.7614 8 24 10.2386 24 13C24 15.7614 21.7614 18 19 18H10"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M6 16H22"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M9 22C9 23.6569 10.3431 25 12 25H18C20.2091 25 22 23.2091 22 21"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="21" cy="11" r="1.5" fill="#0F172A" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-slate-900 ${
            isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl'
          }`}>
            Bee<span className="text-amber-500">Go</span>
          </span>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
            Virajpet
          </span>
        </div>
        {showTagline && !isSmall && (
          <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">
            We deliver you.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-block">{content}</Link>;
  }

  return content;
}

