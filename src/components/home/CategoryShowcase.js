'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Clock, ShieldCheck, HeartPulse, Check } from 'lucide-react';
import FoodIllustration from '../illustrations/FoodIllustration';
import GroceriesIllustration from '../illustrations/GroceriesIllustration';
import MedicineIllustration from '../illustrations/MedicineIllustration';
import DairyIllustration from '../illustrations/DairyIllustration';

const SHOWCASE_ITEMS = [
  {
    id: 'food-dining',
    title: 'Hot Food & Dining',
    subtitle: 'Coorg Kitchens & Cafes',
    description: 'Hot authentic pork curry, akki roti, fragrant biryanis, snacks & baked treats from Virajpet favorites.',
    badge: 'Under 30 Mins',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    link: '/categories/food-dining',
    Illustration: FoodIllustration,
    glowColor: 'from-amber-500/15 via-orange-500/10 to-transparent',
    accentBorder: 'hover:border-amber-400',
    tags: ['Fresh & Hot', 'Local Cafes', 'Coorg Specials'],
  },
  {
    id: 'groceries',
    title: 'Fresh Groceries',
    subtitle: 'Daily Farm Harvest',
    description: 'Farm-fresh vegetables, seasonal fruits, organic cooking oils, Coorg spices, and daily kitchen staples.',
    badge: 'Farm Fresh',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    link: '/categories/groceries',
    Illustration: GroceriesIllustration,
    glowColor: 'from-emerald-500/15 via-green-500/10 to-transparent',
    accentBorder: 'hover:border-emerald-400',
    tags: ['100% Quality', 'Local Market', 'Wholesale Price'],
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy & Wellness',
    subtitle: 'Verified Chemists',
    description: 'Prescription medicines, baby care essentials, emergency first-aid, vitamins, and healthcare wellness.',
    badge: 'Verified Rx',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    link: '/categories/pharmacy',
    Illustration: MedicineIllustration,
    glowColor: 'from-sky-500/15 via-blue-500/10 to-transparent',
    accentBorder: 'hover:border-sky-400',
    tags: ['Genuine Pharma', 'Quick Rx', 'First Aid'],
  },
  {
    id: 'dairy-breakfast',
    title: 'Dairy & Breakfast',
    subtitle: 'Fresh Every Morning',
    description: 'Farm milk pouches, fresh paneer, butter, bakery sourdough breads, eggs, and plantation roasted coffee.',
    badge: 'Daily 7:00 AM',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    link: '/categories/dairy-breakfast',
    Illustration: DairyIllustration,
    glowColor: 'from-indigo-500/15 via-cyan-500/10 to-transparent',
    accentBorder: 'hover:border-indigo-400',
    tags: ['Pure Milk', 'Morning Fresh', 'Estate Coffee'],
  },
];

export default function CategoryShowcase() {
  return (
    <section className="my-10 space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF5EC] border border-[#F0E6D6] text-[#58111E] text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#58111E]" />
            <span>Hyperlocal Essentials</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#380611] tracking-tight">
            Everything Virajpete Needs, Delivered Fast
          </h2>
          <p className="text-xs text-[#7E6569] mt-0.5">
            Hand-picked from verified merchants in Virajpete town
          </p>
        </div>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SHOWCASE_ITEMS.map((item) => {
          const Illustration = item.Illustration;

          return (
            <Link
              key={item.id}
              href={item.link}
              className={`group relative bg-white rounded-3xl border border-[#F0E6D6] ${item.accentBorder} p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
            >
              {/* Subtle Ambient Radial Gradient */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${item.glowColor} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

              {/* Top Row: Badge & Subtitle */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-[11px] font-bold text-[#7E6569]">
                  {item.subtitle}
                </span>
              </div>

              {/* Animated Illustration Centerpiece */}
              <div className="relative z-10 py-4 flex items-center justify-center">
                <div className="w-36 h-36 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Illustration className="w-36 h-36" animated={true} />
                </div>
              </div>

              {/* Content & Action */}
              <div className="relative z-10 space-y-2.5">
                <div>
                  <h3 className="text-base font-black text-[#380611] group-hover:text-[#58111E] transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <ArrowRight className="w-4 h-4 text-[#7E6569] group-hover:text-[#58111E] group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#7E6569] mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Micro tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold text-[#58111E] bg-[#FAF5EC] border border-[#F0E6D6] px-2 py-0.5 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

