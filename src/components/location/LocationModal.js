'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Home, 
  Briefcase, 
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Building,
  Navigation
} from 'lucide-react';
import { useLocation, VIRAJPET_DEFAULT_COORDS } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { calculateDistanceKm } from '../../lib/geo';
import { VIRAJPET_HUB } from '../../lib/virajpetLocalities';
import GoogleMapPicker from './GoogleMapPicker';

export default function LocationModal() {
  const { 
    currentLocation, 
    updateLocation, 
    isLocationModalOpen, 
    setIsLocationModalOpen,
    setServiceable
  } = useLocation();
  const { user } = useAuth();

  const [coords, setCoords] = useState({
    lat: currentLocation?.lat || VIRAJPET_HUB.lat,
    lng: currentLocation?.lng || VIRAJPET_HUB.lng,
  });

  const [addressDetails, setAddressDetails] = useState({
    house: currentLocation?.house || '',
    street: currentLocation?.street || '',
    landmark: currentLocation?.landmark || '',
    area: currentLocation?.area || 'Clock Tower & Main Market',
    tag: currentLocation?.tag || 'Home',
    phone: currentLocation?.phone || '',
  });

  const [coverageStatus, setCoverageStatus] = useState({
    serviceable: true,
    distanceKm: 0,
    zoneName: 'Virajpet Core Delivery Zone',
  });

  // Keep state in sync when modal opens or currentLocation updates
  useEffect(() => {
    if (currentLocation && isLocationModalOpen) {
      setCoords({
        lat: currentLocation.lat || VIRAJPET_HUB.lat,
        lng: currentLocation.lng || VIRAJPET_HUB.lng,
      });
      setAddressDetails({
        house: currentLocation.house || '',
        street: currentLocation.street || '',
        landmark: currentLocation.landmark || '',
        area: currentLocation.area || 'Clock Tower & Main Market',
        tag: currentLocation.tag || 'Home',
        phone: currentLocation.phone || '',
      });
    }
  }, [currentLocation, isLocationModalOpen]);

  // Dynamic distance calculation against Virajpet Clock Tower Hub
  useEffect(() => {
    const dist = calculateDistanceKm(
      VIRAJPET_HUB.lat,
      VIRAJPET_HUB.lng,
      coords.lat,
      coords.lng
    );

    const isCore = dist <= VIRAJPET_HUB.standardRadiusKm;
    const isExtended = dist <= VIRAJPET_HUB.maxRadiusKm;

    setCoverageStatus({
      serviceable: isExtended,
      distanceKm: Number(dist.toFixed(2)),
      zoneName: isCore 
        ? 'Virajpet Standard Delivery Zone (Within 5 km)' 
        : isExtended 
        ? 'Extended Surrounding Virajpet Zone (5-8 km)' 
        : 'Beyond Virajpet Delivery Boundary',
    });
    setServiceable(isExtended);
  }, [coords, setServiceable]);

  if (!isLocationModalOpen) return null;

  const handleSelectAreaFromPicker = (areaObj) => {
    setAddressDetails((prev) => ({
      ...prev,
      area: areaObj.name,
      street: prev.street || areaObj.landmarks || '',
    }));
  };

  const handleSaveAndConfirm = async () => {
    const fullFormatted = `${addressDetails.house ? addressDetails.house + ', ' : ''}${
      addressDetails.street ? addressDetails.street + ', ' : ''
    }${addressDetails.area || 'Virajpet'}, Kodagu - 571218`;

    const locationPayload = {
      lat: coords.lat,
      lng: coords.lng,
      name: addressDetails.area || 'Virajpet Location',
      area: addressDetails.area || 'Virajpet Town',
      street: addressDetails.street,
      house: addressDetails.house,
      landmark: addressDetails.landmark,
      phone: addressDetails.phone,
      tag: addressDetails.tag,
      formattedAddress: fullFormatted,
      serviceable: coverageStatus.serviceable,
      radiusKm: 5.0,
    };

    // If customer is logged in, optionally persist address to account
    if (user) {
      try {
        await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(locationPayload),
        });
      } catch (err) {
        console.warn('Address save fallback:', err);
      }
    }

    updateLocation(locationPayload);
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
      <div className="bg-[#FDFBF7] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#F0E6D6] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F0E6D6] flex items-center justify-between bg-[#FAF5EC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#58111E] text-[#FDFBF7] flex items-center justify-center font-bold shadow-xs">
              <MapPin className="w-5 h-5 text-[#FDFBF7]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#380611]">
                Pick Delivery Location on Google Map
              </h2>
              <p className="text-xs text-[#7E6569]">
                Select on map or choose surrounding areas of Virajpet, Kodagu
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-[#F0E6D6] text-[#7E6569] hover:text-[#380611] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">

          {/* 1. Google Map & Surrounding Localities Component */}
          <GoogleMapPicker
            coords={coords}
            onChangeCoords={setCoords}
            selectedArea={addressDetails.area}
            onSelectArea={handleSelectAreaFromPicker}
          />

          {/* 2. Manual Detailed Address Form */}
          <div className="space-y-4 pt-2 border-t border-[#F0E6D6]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#380611] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#58111E]" />
                <span>Manual Location &amp; House Details</span>
              </h3>
              <span className="text-[10px] text-[#7E6569] bg-[#FAF5EC] px-2 py-0.5 rounded border border-[#F0E6D6]">
                Virajpet, Kodagu - 571218
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* House / Flat / Building / Estate */}
              <div>
                <label className="block text-[11px] font-bold text-[#380611] mb-1">
                  House / Flat / Estate Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Door No. 14/2, Coffee View Estate"
                  value={addressDetails.house}
                  onChange={(e) => setAddressDetails({ ...addressDetails, house: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611] placeholder:text-[#7E6569]"
                />
              </div>

              {/* Street / Road */}
              <div>
                <label className="block text-[11px] font-bold text-[#380611] mb-1">
                  Street / Road Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clock Tower Road, Telugubedha"
                  value={addressDetails.street}
                  onChange={(e) => setAddressDetails({ ...addressDetails, street: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611] placeholder:text-[#7E6569]"
                />
              </div>

              {/* Area / Locality (Editable or selected from map) */}
              <div>
                <label className="block text-[11px] font-bold text-[#380611] mb-1">
                  Area / Locality / Village *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kakotuparambu / Arasikatte / Murnad Rd"
                  value={addressDetails.area}
                  onChange={(e) => setAddressDetails({ ...addressDetails, area: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611] placeholder:text-[#7E6569]"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-[11px] font-bold text-[#380611] mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near St. Anne's Church / Govt Hospital"
                  value={addressDetails.landmark}
                  onChange={(e) => setAddressDetails({ ...addressDetails, landmark: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611] placeholder:text-[#7E6569]"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-[11px] font-bold text-[#380611] mb-1">
                  Delivery Contact Phone *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  value={addressDetails.phone}
                  onChange={(e) => setAddressDetails({ ...addressDetails, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611] font-mono placeholder:text-[#7E6569]"
                />
              </div>

              {/* Save Address Tag */}
              <div>
                <label className="block text-[11px] font-bold text-[#380611] mb-1">
                  Tag Address As:
                </label>
                <div className="flex gap-2">
                  {[
                    { tag: 'Home', icon: Home },
                    { tag: 'Work', icon: Briefcase },
                    { tag: 'Other', icon: Bookmark },
                  ].map(({ tag, icon: Icon }) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setAddressDetails({ ...addressDetails, tag })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        addressDetails.tag === tag
                          ? 'bg-[#58111E] text-[#FDFBF7] border-[#58111E]'
                          : 'bg-white border-[#F0E6D6] text-[#7E6569] hover:bg-[#FAF5EC]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#F0E6D6] bg-[#FAF5EC] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#7E6569] flex items-center gap-2">
            {coverageStatus.serviceable ? (
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{coverageStatus.zoneName} ({coverageStatus.distanceKm} km)</span>
              </span>
            ) : (
              <span className="text-rose-700 font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Outside Virajpet delivery radius ({coverageStatus.distanceKm} km)</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={() => setIsLocationModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7E6569] hover:bg-[#F0E6D6] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndConfirm}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] shadow-md shadow-[#58111E]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Confirm Delivery Pin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
