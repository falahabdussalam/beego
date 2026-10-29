import React from 'react';
import Link from 'next/link';
import { Star, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function StoreCard({ store }) {
  const isOpen = store.isOpen !== false;

  return (
    <Link
      href={`/stores/${store.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover-lift transition-all group flex flex-col justify-between"
    >
      <div>
        {/* Cover Image & Status Badge */}
        <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
          <img
            src={store.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80'}
            alt={store.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
              isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
            <span className="bg-slate-900/80 backdrop-blur-xs text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
              {store.rating || '4.8'}
            </span>
          </div>

          <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{store.deliveryTimeMinutes || '25-30'} mins</span>
          </div>
        </div>

        {/* Store Info */}
        <div className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
              {store.name}
            </h3>
            <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Verified Virajpete Partner" />
          </div>

          <p className="text-xs text-slate-500 line-clamp-1">
            {store.categoryName || store.type || 'Multi-Category Store'}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{store.address || 'Clock Tower Road, Virajpete'}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-600 shrink-0">{store.distanceKm || '1.2'} km</span>
          </div>
        </div>
      </div>

      {/* Footer Tag */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Min Order: ₹{store.minOrderAmount || '99'}</span>
        <span className="text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform">
          Browse Store →
        </span>
      </div>
    </Link>
  );
}

