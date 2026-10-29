'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Utensils, 
  ShoppingBasket, 
  Apple, 
  Pill, 
  Milk, 
  Coffee, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES_DATA } from '../../server/data/categories';

const ICON_MAP = {
  Utensils,
  ShoppingBasket,
  Apple,
  Pill,
  Milk,
  Coffee,
  Sparkles,
};

export const CATEGORIES_LIST = CATEGORIES_DATA.map((c) => ({
  ...c,
  icon: ICON_MAP[c.iconName] || ShoppingBasket,
}));

export default function CategoryGrid({ activeCategory, onSelectCategory }) {
  return (
    <section className="my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#380611] tracking-tight">
            Browse by Category
          </h2>
          <p className="text-xs text-[#7E6569]">
            Hyperlocal delivery across Virajpete
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {CATEGORIES_LIST.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;

          if (onSelectCategory) {
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-[#58111E] text-[#FDFBF7] border-[#58111E] shadow-sm'
                    : 'bg-white border-[#F0E6D6] hover:border-[#58111E]/40 text-[#380611] hover:bg-[#FAF5EC]/50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF5EC] text-[#58111E]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold truncate max-w-full block">
                  {cat.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="bg-white rounded-2xl p-3 border border-[#F0E6D6] hover:border-[#58111E]/50 hover:bg-[#FAF5EC]/40 shadow-2xs transition-all flex flex-col items-center justify-center text-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] group-hover:bg-[#58111E] text-[#58111E] group-hover:text-[#FDFBF7] flex items-center justify-center transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#380611] group-hover:text-[#58111E] transition-colors block truncate max-w-full">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#7E6569] block mt-0.5">
                  {cat.badge}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
