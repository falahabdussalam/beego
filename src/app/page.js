import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Award, 
  Percent,
  TrendingUp 
} from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductCard from '../components/products/ProductCard';
import StoreCard from '../components/stores/StoreCard';
import ServiceAreaBanner from '../components/home/ServiceAreaBanner';
import { getFeaturedStores, getPopularProducts, getDailyOffers } from '../server/data/catalog';

export default async function HomePage() {
  const [stores, popularProducts, offers] = await Promise.all([
    getFeaturedStores(),
    getPopularProducts(),
    getDailyOffers(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Category Grid */}
      <CategoryGrid />

      {/* 3. Daily Genuine Offers Banner */}
      {offers && offers.length > 0 && (
        <section className="my-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Percent className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Daily Offers &amp; Value Packs
                </h2>
                <p className="text-xs text-slate-500">
                  Genuinely configured discounts from verified Virajpete merchants
                </p>
              </div>
            </div>
            <Link
              href="/search?filter=offers"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
            >
              <span>See All Offers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {offers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured Stores / Restaurants */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Top Rated Virajpete Stores
              </h2>
              <p className="text-xs text-slate-500">
                Local restaurants, grocers, pharmacies, and specialty bakeries
              </p>
            </div>
          </div>
          <Link
            href="/search?type=stores"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>View All Stores</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </section>

      {/* 5. Popular Bestsellers Grid */}
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Popular in Virajpete
              </h2>
              <p className="text-xs text-slate-500">
                Most ordered items right now in food, dairy, groceries, and pharmacy
              </p>
            </div>
          </div>
          <Link
            href="/search?sort=popular"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Service Area Information Banner */}
      <ServiceAreaBanner />

      {/* 7. Trust & Safety Standards */}
      <section className="my-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-900">Direct From Virajpete Merchants</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No middle warehouses. Orders are picked fresh directly from local shops, bakeries, and licensed pharmacies in Virajpete.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-900">Guaranteed Safe Delivery</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hygienically handled and temperature-conscious packaging for dairy, hot meals, and refrigerated medicines.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-900">Honest Pricing &amp; Transparent Fees</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Exact store prices, ₹35 standard delivery fee, zero hidden charges, and Cash on Delivery or secure test payments.
          </p>
        </div>
      </section>

    </div>
  );
}

