'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Bike, 
  MapPin, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import HeroIllustrationScene from '../illustrations/HeroIllustrationScene';

export default function HeroBanner() {
  const { currentLocation, setIsLocationModalOpen } = useLocation();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#380611] via-[#58111E] to-[#20040A] text-[#FDFBF7] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#7A162D]/50 shadow-2xl my-6">
      
      {/* Background Subtle Ambient Light */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7A162D]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#C2A786]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Hero Text & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Hyperlocal Service Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#380611]/80 border border-[#7A162D] text-[#FAF5EC] text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E4D5BF]" />
            <span>Hyperlocal Delivery • Virajpete, Kodagu</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Hero Title */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              We deliver Virajpet’s best, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAF5EC] via-[#F0E6D6] to-[#E4D5BF]">
                straight to your doorstep.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#FAF5EC]/85 max-w-xl leading-relaxed">
              From hot Coorg delicacies and daily farm-fresh groceries to life-saving medicines and morning milk — experience 25 to 35 minute delivery across Virajpete town.
            </p>
          </div>

          {/* Current Location Quick Info & CTA */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/categories/groceries"
              className="flex items-center gap-2 px-6 py-3.5 bg-[#FAF5EC] hover:bg-[#F0E6D6] text-[#380611] font-black text-sm rounded-xl shadow-lg shadow-[#20040A]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 text-[#58111E]" />
              <span>Order Essentials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/search?type=stores"
              className="flex items-center gap-2 px-5 py-3.5 bg-[#FAF5EC]/15 hover:bg-[#FAF5EC]/25 text-[#FDFBF7] border border-[#FAF5EC]/30 font-bold text-xs rounded-xl backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Browse Local Stores</span>
            </Link>

            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3.5 bg-[#380611]/80 hover:bg-[#380611] text-[#FAF5EC] border border-[#7A162D] font-semibold text-xs rounded-xl backdrop-blur-md transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#E4D5BF]" />
              <span>Delivering to: <strong className="text-white">{currentLocation.area || 'Virajpete'}</strong></span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#7A162D]/50 text-xs text-[#FAF5EC]/80">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#58111E]/80 text-[#FAF5EC] flex items-center justify-center shrink-0 border border-[#7A162D]/50">
                <Clock className="w-4 h-4" />
              </div>
              <span><strong>25-35 Min</strong> Delivery</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/60 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-800/40">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span><strong>100% Genuine</strong> Local</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#58111E]/80 text-[#FAF5EC] flex items-center justify-center shrink-0 border border-[#7A162D]/50">
                <Bike className="w-4 h-4" />
              </div>
              <span><strong>Real Tracking</strong> Dispatch</span>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Animated Delivery Illustration Scene */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <HeroIllustrationScene />
        </div>

      </div>
    </div>
  );
}
