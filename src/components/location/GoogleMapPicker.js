'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Crosshair,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { VIRAJPET_HUB } from '../../lib/virajpetLocalities';
import { calculateDistanceKm } from '../../lib/geo';

export default function GoogleMapPicker({
  coords,
  onChangeCoords,
  selectedArea,
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [zoom, setZoom] = useState(15);
  const [isLocating, setIsLocating] = useState(false);

  const mapRef = useRef(null);
  const googleMapInstance = useRef(null);
  const markerInstance = useRef(null);

  const distanceKm = calculateDistanceKm(
    VIRAJPET_HUB.lat,
    VIRAJPET_HUB.lng,
    coords.lat,
    coords.lng
  );

  const isStandardDelivery = distanceKm <= VIRAJPET_HUB.standardRadiusKm;
  const isExtendedDelivery = distanceKm > VIRAJPET_HUB.standardRadiusKm && distanceKm <= VIRAJPET_HUB.maxRadiusKm;

  // 1. Try loading Google Maps JS SDK if API key is present
  useEffect(() => {
    if (!apiKey) return;

    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-maps-sdk');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-sdk';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.head.appendChild(script);
    }
  }, [apiKey]);

  // 2. Initialize interactive Google Map when SDK is ready
  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current || !window.google) return;

    const initialPos = { lat: coords.lat, lng: coords.lng };

    googleMapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: initialPos,
      zoom: zoom,
      mapTypeId: mapType,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    markerInstance.current = new window.google.maps.Marker({
      position: initialPos,
      map: googleMapInstance.current,
      draggable: true,
      title: 'Your Delivery Location (Virajpet)',
      animation: window.google.maps.Animation.DROP,
    });

    // Map click drops marker
    googleMapInstance.current.addListener('click', (e) => {
      const newLat = Number(e.latLng.lat().toFixed(4));
      const newLng = Number(e.latLng.lng().toFixed(4));
      markerInstance.current.setPosition({ lat: newLat, lng: newLng });
      onChangeCoords({ lat: newLat, lng: newLng });
    });

    // Marker drag updates position
    markerInstance.current.addListener('dragend', (e) => {
      const newLat = Number(e.latLng.lat().toFixed(4));
      const newLng = Number(e.latLng.lng().toFixed(4));
      onChangeCoords({ lat: newLat, lng: newLng });
    });
  }, [googleMapsLoaded]);

  // Sync coords to existing Google Map instance
  useEffect(() => {
    if (googleMapInstance.current && markerInstance.current) {
      const newPos = { lat: coords.lat, lng: coords.lng };
      markerInstance.current.setPosition(newPos);
      googleMapInstance.current.panTo(newPos);
    }
  }, [coords.lat, coords.lng]);

  // Handle GPS location click
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newCoords = {
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
        };
        onChangeCoords(newCoords);
      },
      (err) => {
        setIsLocating(false);
        alert(err.code === 1 ? 'Location permission was denied.' : 'Unable to acquire GPS coordinates.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Micro pan adjustment for non-API key / keyboard / touchscreen navigation
  const handleNudgePin = (deltaLat, deltaLng) => {
    onChangeCoords({
      lat: Number((coords.lat + deltaLat).toFixed(4)),
      lng: Number((coords.lng + deltaLng).toFixed(4)),
    });
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Google Map Selection Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[#F0E6D6] shadow-sm bg-[#FAF5EC]">
        
        {/* Full Google Map JS (if API key active) or Interactive Google Maps Live Embed */}
        {apiKey && googleMapsLoaded ? (
          <div ref={mapRef} className="w-full h-64 sm:h-72" />
        ) : (
          <div className="relative w-full h-64 sm:h-72 bg-[#FAF5EC] overflow-hidden">
            {/* Live Google Map iframe embed (renders genuine Google Map without API key required) */}
            <iframe
              title="Google Map Virajpet"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=${zoom}&output=embed`}
              className="w-full h-full opacity-90 transition-opacity"
            />

            {/* Interactive Target Reticle / Pin in Center */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative flex flex-col items-center -translate-y-5 animate-bounce">
                <div className="p-2 bg-[#58111E] text-[#FDFBF7] rounded-full shadow-xl border-2 border-white ring-2 ring-[#58111E]/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="w-2.5 h-1 bg-black/40 rounded-full blur-[1px] mt-0.5" />
              </div>
            </div>

            {/* Micro-adjuster control pad (allows dragging / moving pin anywhere in Virajpet) */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-[#F0E6D6] shadow-lg flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold text-[#7E6569] uppercase">Nudge Pin</span>
              <button
                type="button"
                onClick={() => handleNudgePin(0.0015, 0)}
                className="p-1 hover:bg-[#FAF5EC] rounded text-[#58111E]"
                title="Move North"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleNudgePin(0, -0.0015)}
                  className="p-1 hover:bg-[#FAF5EC] rounded text-[#58111E]"
                  title="Move West"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeCoords({ lat: VIRAJPET_HUB.lat, lng: VIRAJPET_HUB.lng })}
                  className="p-1 bg-[#FAF5EC] hover:bg-[#F0E6D6] rounded text-[10px] font-black text-[#58111E]"
                  title="Reset to Clock Tower"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNudgePin(0, 0.0015)}
                  className="p-1 hover:bg-[#FAF5EC] rounded text-[#58111E]"
                  title="Move East"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleNudgePin(-0.0015, 0)}
                className="p-1 hover:bg-[#FAF5EC] rounded text-[#58111E]"
                title="Move South"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Top Controls: GPS Locate & View Mode */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <button
            type="button"
            onClick={handleUseGPS}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-[#58111E] font-bold text-xs rounded-xl shadow-md border border-[#F0E6D6] backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#58111E] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Locate My GPS'}</span>
          </button>

          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#F0E6D6] shadow-md text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                mapType === 'roadmap' ? 'bg-[#58111E] text-white' : 'text-[#7E6569] hover:text-[#380611]'
              }`}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                mapType === 'satellite' ? 'bg-[#58111E] text-white' : 'text-[#7E6569] hover:text-[#380611]'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Live Distance & Serviceability Badge */}
        <div className="p-3 bg-white border-t border-[#F0E6D6] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              isStandardDelivery ? 'bg-emerald-500' : isExtendedDelivery ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
            <span className="font-bold text-[#380611]">
              {selectedArea || 'Virajpet Location'}:
            </span>
            <span className="font-semibold text-[#7E6569]">
              {distanceKm} km from Clock Tower
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isStandardDelivery 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : isExtendedDelivery 
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}>
              {isStandardDelivery
                ? '✓ 25-35 Min Standard Delivery'
                : isExtendedDelivery
                ? '📍 Extended Surrounding Zone'
                : '⚠ Outside Core Area'}
            </span>

            <a
              href={`https://maps.google.com/?q=${coords.lat},${coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58111E] hover:underline flex items-center gap-1 text-[11px] font-semibold"
              title="Open pin in full Google Maps"
            >
              <span>View in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
