import React from 'react';
import Link from 'next/link';

export default function Logo({ showTagline = true, size = 'default', href = '/' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const content = (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Custom Bee Emblem in Dark Maroon with Light Cream Accents */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#58111E] to-[#380611] shadow-md shadow-[#58111E]/25 text-[#FDFBF7] font-black tracking-tighter ${
        isLarge ? 'w-12 h-12 text-2xl' : isSmall ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl'
      }`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isLarge ? 'w-7 h-7' : isSmall ? 'w-5 h-5' : 'w-6 h-6'}
        >
          {/* Stylized Bee Stripes & Wing Shape in Light Cream */}
          <path
            d="M8 12C8 9.79086 9.79086 8 12 8H19C21.7614 8 24 10.2386 24 13C24 15.7614 21.7614 18 19 18H10"
            stroke="#FDFBF7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M6 16H22"
            stroke="#FAF5EC"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M9 22C9 23.6569 10.3431 25 12 25H18C20.2091 25 22 23.2091 22 21"
            stroke="#FDFBF7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="21" cy="11" r="1.5" fill="#FDFBF7" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-[#380611] ${
            isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl'
          }`}>
            Bee<span className="text-[#941834]">Go</span>
          </span>
          <span className="bg-[#FAF5EC] text-[#58111E] border border-[#F0E6D6] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
            Virajpet
          </span>
        </div>
        {showTagline && !isSmall && (
          <span className="text-[11px] font-medium text-[#7E6569] tracking-wide mt-0.5">
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
