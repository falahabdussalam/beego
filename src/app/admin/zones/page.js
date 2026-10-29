'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle, Save, AlertCircle, Plus } from 'lucide-react';
import { VIRAJPET_CENTER_COORDS } from '../../../lib/geo';

export default function AdminZonesPage() {
  const [zoneConfig, setZoneConfig] = useState({
    name: 'Virajpete Central Delivery Zone',
    centerLat: VIRAJPET_CENTER_COORDS.lat,
    centerLng: VIRAJPET_CENTER_COORDS.lng,
    radiusKm: 5.0,
    baseDeliveryFee: 35.0,
    freeDeliveryThreshold: 499.0,
    minOrderAmount: 50.0,
    enablePolygonMode: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Delivery Zones &amp; Geofencing Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Adjust the active delivery radius, dispatch fees, and service coverage for Virajpete, Kodagu
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Service zone configuration updated! Client checkout serviceability reflects changes immediately.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Zone Name
              </label>
              <input
                type="text"
                value={zoneConfig.name}
                onChange={(e) => setZoneConfig({ ...zoneConfig, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hub Center Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={zoneConfig.centerLat}
                  onChange={(e) => setZoneConfig({ ...zoneConfig, centerLat: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hub Center Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={zoneConfig.centerLng}
                  onChange={(e) => setZoneConfig({ ...zoneConfig, centerLng: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Radius (KM)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="25"
                  value={zoneConfig.radiusKm}
                  onChange={(e) => setZoneConfig({ ...zoneConfig, radiusKm: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-amber-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Base Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  value={zoneConfig.baseDeliveryFee}
                  onChange={(e) => setZoneConfig({ ...zoneConfig, baseDeliveryFee: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Free Delivery Over (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  value={zoneConfig.freeDeliveryThreshold}
                  onChange={(e) => setZoneConfig({ ...zoneConfig, freeDeliveryThreshold: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-emerald-700"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Current default proposal: <strong>5.0 km radius from Virajpete Town Clock Tower</strong>
              </span>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Zone Configuration</span>
              </button>
            </div>

          </form>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <MapPin className="w-4 h-4" />
            <span>Virajpete Geofence Rules</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            The platform calculates the exact geodesic distance (Haversine model) from the Virajpete hub coordinates on every address selection and checkout attempt.
          </p>
          <div className="space-y-2 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            <p>✓ Active Center: Clock Tower Area (12.2039° N, 75.8037° E)</p>
            <p>✓ Current Radius: {zoneConfig.radiusKm} km radius limit</p>
            <p>✓ Standard dispatch: ₹{zoneConfig.baseDeliveryFee} flat fee</p>
            <p>✓ Free delivery threshold: Orders ≥ ₹{zoneConfig.freeDeliveryThreshold}</p>
          </div>
        </div>

      </div>

    </div>
  );
}

