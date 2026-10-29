import React from 'react';
import Link from 'next/link';
import { Star, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function StoreCard({ store }) {
  const isOpen = store.isOpen !== false;

  return (
    <Link
      href={`/stores/${store.id}`}
      className="bg-white rounded-2xl border border-[#F0E6D6] hover:border-[#58111E]/40 overflow-hidden shadow-2xs hover-lift transition-all group flex flex-col justify-between"
    >
      <div>
        {/* Cover Image & Status Badge */}
        <div className="relative aspect-16/9 bg-[#FAF5EC] overflow-hidden">
          <img
            src={store.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80'}
            alt={store.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
              isOpen ? 'bg-emerald-600 text-white' : 'bg-[#380611] text-[#FAF5EC]'
            }`}>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
            <span className="bg-[#380611]/85 backdrop-blur-xs text-[#FAF5EC] text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              {store.rating || '4.8'}
            </span>
          </div>

          <div className="absolute bottom-2 right-2 bg-[#380611]/85 backdrop-blur-xs text-[#FDFBF7] text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#E4D5BF]" />
            <span>{store.deliveryTimeMinutes || '25-30'} mins</span>
          </div>
        </div>

        {/* Store Info */}
        <div className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#380611] group-hover:text-[#58111E] transition-colors line-clamp-1">
              {store.name}
            </h3>
            <CheckCircle className="w-3.5 h-3.5 text-[#58111E] shrink-0" title="Verified Virajpete Partner" />
          </div>

          <p className="text-xs text-[#7E6569] line-clamp-1">
            {store.categoryName || store.type || 'Multi-Category Store'}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-[#7E6569] pt-1">
            <MapPin className="w-3 h-3 text-[#7E6569] shrink-0" />
            <span className="truncate">{store.address || 'Clock Tower Road, Virajpete'}</span>
            <span className="text-[#F0E6D6]">•</span>
            <span className="font-semibold text-[#380611] shrink-0">{store.distanceKm || '1.2'} km</span>
          </div>
        </div>
      </div>

      {/* Footer Tag */}
      <div className="px-4 py-2.5 bg-[#FAF5EC] border-t border-[#F0E6D6] flex items-center justify-between text-[11px] text-[#7E6569]">
        <span>Min Order: ₹{store.minOrderAmount || '99'}</span>
        <span className="text-[#58111E] font-bold group-hover:translate-x-0.5 transition-transform">
          Browse Store →
        </span>
      </div>
    </Link>
  );
}
