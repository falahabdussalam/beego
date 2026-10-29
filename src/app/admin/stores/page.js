'use client';

import React, { useState } from 'react';
import { Store, Star, Clock, MapPin, Phone, Power } from 'lucide-react';
import { INITIAL_STORES } from '../../../server/data/catalog';

export default function AdminStoresPage() {
  const [stores, setStores] = useState(INITIAL_STORES);

  const toggleStore = (id) => {
    setStores(
      stores.map((s) => (s.id === id ? { ...s, isOpen: !s.isOpen } : s))
    );
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Partner Stores &amp; Restaurants
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Registered local merchants operating in Virajpete, Kodagu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((s) => (
          <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  s.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {s.isOpen ? 'Active & Open' : 'Closed'}
                </span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {s.rating}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">{s.name}</h2>
                <p className="text-xs text-slate-400">{s.type} • {s.categoryName}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{s.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{s.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Avg Dispatch: {s.deliveryTimeMinutes} mins</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Min Order: ₹{s.minOrderAmount}</span>
              <button
                onClick={() => toggleStore(s.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  s.isOpen
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {s.isOpen ? 'Pause Orders' : 'Reopen Store'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

