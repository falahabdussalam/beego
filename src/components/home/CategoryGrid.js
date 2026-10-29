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

export default function CategoryGrid() {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#380611] tracking-tight">
            Explore Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#7E6569] mt-0.5">
            Everything you need in Virajpete delivered from trusted merchants
          </p>
        </div>
        <Link
          href="/categories"
          className="text-xs font-bold text-[#58111E] hover:text-[#7A162D] flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {CATEGORIES_LIST.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="bg-white rounded-2xl p-3.5 border border-[#F0E6D6] hover:border-[#58111E]/50 hover:bg-[#FAF5EC]/40 shadow-2xs hover-lift transition-all flex flex-col justify-between group"
            >
              {/* Image & Badge */}
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#FAF5EC] mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-1.5 left-1.5 bg-[#380611]/85 backdrop-blur-xs text-[#FAF5EC] text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {cat.badge}
                </span>
              </div>

              {/* Title & Icon */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`p-1 rounded-md bg-gradient-to-br ${cat.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#380611] group-hover:text-[#58111E] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {cat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
