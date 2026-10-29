import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES_LIST } from '../../components/home/CategoryGrid';
import { getPopularProducts } from '../../server/data/catalog';
import ProductCard from '../../components/products/ProductCard';

export const metadata = {
  title: 'All Categories — BeeGo Delivery Virajpete',
  description: 'Browse all delivery categories in Virajpete including Food, Groceries, Fruits & Vegetables, Pharmacy, and Dairy.',
};

export default async function CategoriesPage() {
  const allProducts = await getPopularProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Browse by Category
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore all essential shopping and food delivery categories available in Virajpete, Kodagu
        </p>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_LIST.map((cat) => {
          const Icon = cat.icon;
          const catProducts = allProducts.filter((p) => p.categoryId === cat.id);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover-lift transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {cat.badge}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      {cat.name}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="text-[11px] text-slate-400 font-medium pt-1">
                    {catProducts.length} items available in Virajpete
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <Link
                  href={`/categories/${cat.id}`}
                  className="flex items-center justify-between text-xs font-bold text-amber-600 hover:text-amber-700"
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

