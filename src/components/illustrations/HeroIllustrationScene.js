'use client';

import React from 'react';
import Link from 'next/link';
import FoodIllustration from './FoodIllustration';
import GroceriesIllustration from './GroceriesIllustration';
import MedicineIllustration from './MedicineIllustration';
import DairyIllustration from './DairyIllustration';
import DeliveryIllustration from './DeliveryIllustration';

export default function HeroIllustrationScene() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none h-[340px] sm:h-[380px] lg:h-[400px] flex items-center justify-center select-none">
      
      {/* Ambient background glow rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-[#7A162D]/30 blur-2xl animate-pulse" />
        <div className="w-48 h-48 rounded-full border border-[#FAF5EC]/10 animate-spin-slow pointer-events-none" />
      </div>

      {/* --- CENTRAL DELIVERY HERO --- */}
      <div className="relative z-10 transition-transform duration-300 hover:scale-105">
        <DeliveryIllustration className="w-64 sm:w-76 lg:w-84 h-48 sm:h-56" animated={true} />
        
        {/* Express 25-35 Min delivery badge floating below scooter */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#20040A]/90 border border-[#FAF5EC]/20 text-[#FAF5EC] text-[11px] font-black shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Express 25-35 Mins Across Virajpet</span>
        </div>
      </div>

      {/* --- FLOATING SATELLITE CARDS --- */}

      {/* 1. Hot Food (Top-Left) */}
      <Link
        href="/categories/food-dining"
        className="absolute top-2 sm:top-4 left-0 sm:left-2 z-20 group"
      >
        <div className="animate-float-gentle flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl bg-[#2A050D]/85 border border-[#FAF5EC]/20 hover:border-[#F59E0B] shadow-xl backdrop-blur-md transition-all group-hover:scale-105 group-hover:bg-[#380611]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-500/30 flex items-center justify-center p-0.5 overflow-hidden">
            <FoodIllustration className="w-11 h-11" animated={true} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black text-[#FAF5EC] group-hover:text-amber-300 transition-colors">
                Hot Meals
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <span className="text-[10px] text-[#FAF5EC]/70 block font-medium">
              Coorg Delicacies
            </span>
          </div>
        </div>
      </Link>

      {/* 2. Farm Fresh Groceries (Top-Right) */}
      <Link
        href="/categories/groceries"
        className="absolute top-4 sm:top-6 right-0 sm:right-2 z-20 group"
      >
        <div className="animate-float-delayed flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl bg-[#2A050D]/85 border border-[#FAF5EC]/20 hover:border-emerald-400 shadow-xl backdrop-blur-md transition-all group-hover:scale-105 group-hover:bg-[#380611]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/30 border border-emerald-500/30 flex items-center justify-center p-0.5 overflow-hidden">
            <GroceriesIllustration className="w-11 h-11" animated={true} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black text-[#FAF5EC] group-hover:text-emerald-300 transition-colors">
                Groceries
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] text-[#FAF5EC]/70 block font-medium">
              Farm Fresh Daily
            </span>
          </div>
        </div>
      </Link>

      {/* 3. Pharmacy & Medicine (Bottom-Left) */}
      <Link
        href="/categories/pharmacy"
        className="absolute bottom-6 sm:bottom-8 left-2 sm:left-4 z-20 group"
      >
        <div className="animate-float-delayed flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl bg-[#2A050D]/85 border border-[#FAF5EC]/20 hover:border-sky-400 shadow-xl backdrop-blur-md transition-all group-hover:scale-105 group-hover:bg-[#380611]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/30 border border-sky-500/30 flex items-center justify-center p-0.5 overflow-hidden">
            <MedicineIllustration className="w-11 h-11" animated={true} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black text-[#FAF5EC] group-hover:text-sky-300 transition-colors">
                Medicines
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            </div>
            <span className="text-[10px] text-[#FAF5EC]/70 block font-medium">
              Verified Rx
            </span>
          </div>
        </div>
      </Link>

      {/* 4. Pure Dairy & Morning (Bottom-Right) */}
      <Link
        href="/categories/dairy-breakfast"
        className="absolute bottom-4 sm:bottom-6 right-2 sm:right-4 z-20 group"
      >
        <div className="animate-float-gentle flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl bg-[#2A050D]/85 border border-[#FAF5EC]/20 hover:border-cyan-300 shadow-xl backdrop-blur-md transition-all group-hover:scale-105 group-hover:bg-[#380611]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/30 border border-cyan-500/30 flex items-center justify-center p-0.5 overflow-hidden">
            <DairyIllustration className="w-11 h-11" animated={true} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black text-[#FAF5EC] group-hover:text-cyan-200 transition-colors">
                Dairy &amp; Coffee
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
            </div>
            <span className="text-[10px] text-[#FAF5EC]/70 block font-medium">
              Fresh Daily 7 AM
            </span>
          </div>
        </div>
      </Link>

    </div>
  );
}

