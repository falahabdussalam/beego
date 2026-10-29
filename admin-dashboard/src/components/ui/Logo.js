import React from 'react';
import Link from 'next/link';

export default function Logo({ showTagline = false }) {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-9 h-9 rounded-2xl bg-amber-400 text-[#380611] flex items-center justify-center font-black text-lg shadow-sm border border-amber-300 group-hover:scale-105 transition-transform">
        🐝
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="font-black text-base text-[#FDFBF7] tracking-tight">
            Bee<span className="text-amber-400">Go</span>
          </span>
          <span className="text-[10px] font-bold text-amber-200/80 uppercase tracking-widest">
            Dispatch
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-amber-100/70 -mt-1 block">
            We deliver you.
          </span>
        )}
      </div>
    </Link>
  );
}
