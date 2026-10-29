import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, MapPin, Phone, ShieldCheck, ArrowLeft, Info } from 'lucide-react';
import { getStoreById, INITIAL_PRODUCTS } from '../../../server/data/catalog';
import ProductCard from '../../../components/products/ProductCard';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const store = await getStoreById(id);
  if (!store) return { title: 'Store Not Found — BeeGo Delivery' };

  return {
    title: `${store.name} — BeeGo Delivery Virajpete`,
    description: `Order from ${store.name} in Virajpete, Kodagu. Rating ${store.rating}★. Delivered in ${store.deliveryTimeMinutes} minutes.`,
  };
}

export default async function StoreDetailPage({ params }) {
  const { id } = await params;
  const store = await getStoreById(id);

  if (!store) {
    notFound();
  }

  const products = INITIAL_PRODUCTS.filter((p) => p.storeId === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/search?type=stores" className="hover:text-slate-900 transition-colors">
          Stores
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-900">{store.name}</span>
      </div>

      {/* Store Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="relative aspect-21/9 sm:aspect-28/9 bg-slate-900 overflow-hidden">
          <img
            src={store.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'}
            alt={store.name}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                Open for Delivery
              </span>
              <span className="bg-slate-900/80 backdrop-blur-xs text-amber-400 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {store.rating} Rating
              </span>
              <span className="bg-slate-900/80 backdrop-blur-xs text-slate-200 text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {store.deliveryTimeMinutes} mins delivery
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {store.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {store.address}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                {store.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Operating policy notice */}
        <div className="p-4 bg-amber-50 border-t border-amber-200/60 flex items-center gap-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Single-Merchant Policy:</strong> Items from this store will be fulfilled and delivered directly by dedicated BeeGo delivery partners.
          </span>
        </div>
      </div>

      {/* Store Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Store Catalog ({products.length} Products)
            </h2>
            <p className="text-xs text-slate-500">
              Fresh stock ready for dispatch in Virajpete
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
            No products currently listed from this store.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

