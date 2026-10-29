'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  Home, 
  Briefcase, 
  Bookmark,
  Search
} from 'lucide-react';
import { useLocation, VIRAJPET_DEFAULT_COORDS } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { calculateDistanceKm } from '../../lib/geo';

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
    lat: currentLocation.lat || VIRAJPET_DEFAULT_COORDS.lat,
    lng: currentLocation.lng || VIRAJPET_DEFAULT_COORDS.lng,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [addressDetails, setAddressDetails] = useState({
    house: '',
    street: '',
    landmark: '',
    area: currentLocation.area || 'Virajpete Town',
    tag: 'Home',
    phone: '',
  });

  const [isLocating, setIsLocating] = useState(false);
  const [coverageStatus, setCoverageStatus] = useState({
    serviceable: true,
    distanceKm: 0,
    zoneName: 'Virajpete Central Delivery Zone',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Check distance and serviceability whenever coords change
  useEffect(() => {
    const dist = calculateDistanceKm(
      VIRAJPET_DEFAULT_COORDS.lat,
      VIRAJPET_DEFAULT_COORDS.lng,
      coords.lat,
      coords.lng
    );

    const isCovered = dist <= (currentLocation.radiusKm || 5.0);
    setCoverageStatus({
      serviceable: isCovered,
      distanceKm: Number(dist.toFixed(2)),
      zoneName: isCovered ? 'Virajpete Central 5KM Zone' : 'Outside Service Zone',
    });
    setServiceable(isCovered);
  }, [coords, currentLocation.radiusKm, setServiceable]);

  // Fetch user's saved addresses if logged in
  useEffect(() => {
    if (user && isLocationModalOpen) {
      fetch('/api/addresses')
        .then((res) => (res.ok ? res.json() : { addresses: [] }))
        .then((data) => setSavedAddresses(data.addresses || []))
        .catch(() => setSavedAddresses([]));
    }
  }, [user, isLocationModalOpen]);

  if (!isLocationModalOpen) return null;

  // Handle browser geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setStatusMessage('Requesting GPS location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCoords(newCoords);
        setIsLocating(false);
        setStatusMessage('Location captured. Checking serviceability...');

        // Verify with server geocoding endpoint
        try {
          const res = await fetch(
            `/api/serviceability?lat=${newCoords.lat}&lng=${newCoords.lng}`
          );
          if (res.ok) {
            const data = await res.json();
            setCoverageStatus({
              serviceable: data.serviceable,
              distanceKm: data.distanceKm,
              zoneName: data.zoneName || 'Virajpete Hub',
            });
            if (data.address) {
              setAddressDetails((prev) => ({
                ...prev,
                area: data.address.area || prev.area,
                street: data.address.street || prev.street,
              }));
            }
          }
        } catch (e) {
          console.warn('Serviceability API error:', e);
        }
      },
      (err) => {
        setIsLocating(false);
        setStatusMessage('');
        let msg = 'Unable to retrieve location.';
        if (err.code === 1) msg = 'Location access denied. Please select location manually.';
        alert(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Quick select common Virajpete areas
  const VIRAJPET_AREAS = [
    { name: 'Clock Tower & Main Market', lat: 12.2039, lng: 75.8037 },
    { name: 'Telugubedha', lat: 12.2085, lng: 75.8015 },
    { name: 'Arasikatte', lat: 12.1990, lng: 75.8062 },
    { name: 'Maletirike Hill Area', lat: 12.2065, lng: 75.8112 },
    { name: 'Kadanga Road', lat: 12.2150, lng: 75.7950 },
    { name: 'Bittangala Junction (4.2 km)', lat: 12.1820, lng: 75.8320 },
  ];

  const handleSelectPredefinedArea = (area) => {
    setCoords({ lat: area.lat, lng: area.lng });
    setAddressDetails((prev) => ({
      ...prev,
      area: area.name,
    }));
  };

  const handleSaveAndConfirm = async () => {
    const fullFormatted = `${addressDetails.house ? addressDetails.house + ', ' : ''}${
      addressDetails.street ? addressDetails.street + ', ' : ''
    }${addressDetails.area}, Virajpete, Kodagu - 571218`;

    const locationPayload = {
      lat: coords.lat,
      lng: coords.lng,
      name: addressDetails.area,
      area: addressDetails.area,
      street: addressDetails.street,
      house: addressDetails.house,
      landmark: addressDetails.landmark,
      phone: addressDetails.phone,
      tag: addressDetails.tag,
      formattedAddress: fullFormatted,
      serviceable: coverageStatus.serviceable,
      radiusKm: 5.0,
    };

    // If user is authenticated, also save to database
    if (user) {
      try {
        await fetch('/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(locationPayload),
        });
      } catch (err) {
        console.warn('Address save failed:', err);
      }
    }

    updateLocation(locationPayload);
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Select Delivery Location</h2>
              <p className="text-xs text-slate-500">Virajpete, Kodagu delivery coverage verification</p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* GPS Button & Serviceability Banner */}
          <div className="space-y-3">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50/50 hover:bg-amber-50 text-amber-900 font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:border-amber-500 disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 text-amber-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting GPS Coordinates...' : 'Use My Current GPS Location'}</span>
            </button>

            {/* Coverage Status Badge */}
            <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              coverageStatus.serviceable 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              {coverageStatus.serviceable ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <p className="font-bold">
                  {coverageStatus.serviceable
                    ? 'Delivery Available at this location!'
                    : 'Location outside active delivery zone'}
                </p>
                <p className="mt-0.5 opacity-80">
                  {coverageStatus.serviceable
                    ? `Within ${coverageStatus.distanceKm} km from Virajpete Town Hub. Estimated delivery: 25-35 mins.`
                    : `Currently ${coverageStatus.distanceKm} km from Virajpete Town Hub (Exceeds configured 5 km radius).`}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Area Selector for Virajpete Localities */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Popular Localities in Virajpete
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VIRAJPET_AREAS.map((area) => (
                <button
                  key={area.name}
                  onClick={() => handleSelectPredefinedArea(area)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    coords.lat === area.lat && coords.lng === area.lng
                      ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="block font-bold truncate">{area.name}</span>
                  <span className="text-[10px] text-slate-400">Virajpete, Kodagu</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Map Visual Coordinates Card */}
          <div className="p-3 bg-slate-900 rounded-xl text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-amber-400 font-bold">
                Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                Hub Ref: Virajpete (12.2039° N, 75.8037° E)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real coordinate verification active. To adjust delivery radius or polygon boundaries, visit the Administrator Service Zones module.
            </p>
          </div>

          {/* Detailed Address Inputs */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Address Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  House / Flat / Building No. *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Door No. 14/2, Kodagu Villa"
                  value={addressDetails.house}
                  onChange={(e) => setAddressDetails({ ...addressDetails, house: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Street / Road Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Clock Tower Road"
                  value={addressDetails.street}
                  onChange={(e) => setAddressDetails({ ...addressDetails, street: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near St. Anne's Church"
                  value={addressDetails.landmark}
                  onChange={(e) => setAddressDetails({ ...addressDetails, landmark: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Delivery Contact Phone *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={addressDetails.phone}
                  onChange={(e) => setAddressDetails({ ...addressDetails, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-amber-500 outline-hidden"
                />
              </div>
            </div>

            {/* Address Tag Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Save Address As:
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      addressDetails.tag === tag
                        ? 'bg-[#58111E] text-[#FDFBF7] border-[#58111E]'
                        : 'border-[#F0E6D6] text-[#7E6569] hover:bg-[#FAF5EC]'
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

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#F0E6D6] bg-[#FAF5EC] flex items-center justify-between">
          <div className="text-xs text-[#7E6569]">
            {coverageStatus.serviceable ? (
              <span className="text-emerald-700 font-bold">✓ Ready for delivery</span>
            ) : (
              <span className="text-rose-600 font-bold">⚠ Delivery may be delayed or unavailable</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLocationModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7E6569] hover:bg-[#F0E6D6] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndConfirm}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] shadow-md shadow-[#58111E]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Confirm Location
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
