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
import { getAllProducts } from '../../server/data/catalog';

const ICON_MAP = {
  Utensils,
  ShoppingBasket,
  Apple,
  Pill,
  Milk,
  Coffee,
  Sparkles,
};

export const metadata = {
  title: 'All Categories — BeeGo Delivery Virajpete',
  description: 'Browse all delivery categories in Virajpete including Food, Groceries, Fruits & Vegetables, Pharmacy, and Dairy.',
};

export default async function CategoriesPage() {
  const allProducts = await getAllProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#380611] tracking-tight">
          Browse by Category
        </h1>
        <p className="text-xs sm:text-sm text-[#7E6569] mt-1">
          Explore essential shopping and food delivery categories available in Virajpete, Kodagu
        </p>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES_DATA.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || ShoppingBasket;
          const catProducts = allProducts.filter((p) => p.categoryId === cat.id);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-[#F0E6D6] overflow-hidden shadow-2xs hover-lift transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center border border-[#F0E6D6]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="bg-[#FAF5EC] text-[#58111E] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#F0E6D6]">
                    {cat.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[#380611]">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-[#7E6569] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="text-[11px] text-[#58111E] font-bold pt-1">
                  {catProducts.length} {catProducts.length === 1 ? 'item' : 'items'} available
                </div>
              </div>

              <div className="p-4 bg-[#FAF5EC] border-t border-[#F0E6D6]">
                <Link
                  href={`/categories/${cat.id}`}
                  className="flex items-center justify-between text-xs font-bold text-[#58111E] hover:text-[#7A162D] transition-colors"
                >
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
