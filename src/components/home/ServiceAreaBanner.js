'use client';

import React from 'react';
import { MapPin, CheckCircle2, Shield, Navigation } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export default function ServiceAreaBanner() {
  const { currentLocation, setIsLocationModalOpen } = useLocation();

  return (
    <section className="my-12 bg-white rounded-3xl border border-[#F0E6D6] p-6 sm:p-8 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Info Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EC] text-[#58111E] text-xs font-bold border border-[#F0E6D6]">
            <MapPin className="w-3.5 h-3.5 text-[#58111E]" />
            <span>Virajpete Local Hub</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#380611] tracking-tight">
            Serving Virajpete Town &amp; Within 5 km Coverage Radius
          </h2>

          <p className="text-xs sm:text-sm text-[#7E6569] leading-relaxed">
            BeeGo operates dedicated delivery partners stationed in Virajpete center. Our rapid dispatch radius includes Clock Tower, Telugubedha, Arasikatte, Maletirike, Kadanga Road, and surrounding estates.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6]">
              <span className="text-[10px] uppercase font-bold text-[#7E6569] block">Hub Coordinates</span>
              <strong className="text-[#380611] font-mono text-[11px]">12.2039° N, 75.8037° E</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6]">
              <span className="text-[10px] uppercase font-bold text-[#7E6569] block">Delivery Radius</span>
              <strong className="text-emerald-700 font-bold">5.0 Kilometers</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-[#7E6569] block">Standard Fee</span>
              <strong className="text-[#380611] font-bold">₹35 (Free &gt; ₹499)</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#E4D5BF]" />
              <span>Check My Exact Address</span>
            </button>
            <span className="text-xs text-[#7E6569]">
              Currently delivering to: <strong className="text-[#380611]">{currentLocation.area || 'Virajpete'}</strong>
            </span>
          </div>
        </div>

        {/* Visual Map Badge Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#380611] to-[#20040A] text-[#FDFBF7] rounded-2xl p-6 border border-[#7A162D]/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#7A162D]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FAF5EC] uppercase tracking-wider">
                Geofenced Delivery Zone
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Zone
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Virajpete Central Market &amp; Clock Tower Area</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Maletirike Hills &amp; Temple Environs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Telugubedha &amp; Arasikatte Layouts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gonikoppal Highway Exit (up to 5 km limit)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#7A162D]/50 text-[11px] text-[#FAF5EC]/70">
              * Outside the 5 km radius? Orders may be accepted based on custom delivery partner dispatch and merchant operating policies.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
