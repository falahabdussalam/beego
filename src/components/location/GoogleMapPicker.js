'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Crosshair,
  ExternalLink,
  Search,
  Layers,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { VIRAJPET_HUB, VIRAJPET_LOCALITIES } from '../../lib/virajpetLocalities';
import { calculateDistanceKm } from '../../lib/geo';

export default function GoogleMapPicker({
  coords = { lat: VIRAJPET_HUB.lat, lng: VIRAJPET_HUB.lng },
  onChangeCoords,
  selectedArea = '',
  onSelectArea
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Mode & State
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [zoom, setZoom] = useState(15);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsMessage, setGpsMessage] = useState(null);
  const [localitySearch, setLocalitySearch] = useState('');
  const [showLocalityPicker, setShowLocalityPicker] = useState(false);

  // Map Provider States
  const [provider, setProvider] = useState('leaflet'); // 'google' | 'leaflet' | 'canvas'
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // DOM & Map references
  const mapContainerRef = useRef(null);
  const googleMapRef = useRef(null);
  const googleMarkerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const leafletMarkerRef = useRef(null);
  const leafletTileLayerRef = useRef(null);

  // Current safe coordinates
  const currentLat = typeof coords?.lat === 'number' && !isNaN(coords.lat) ? coords.lat : VIRAJPET_HUB.lat;
  const currentLng = typeof coords?.lng === 'number' && !isNaN(coords.lng) ? coords.lng : VIRAJPET_HUB.lng;

  // Real-time distance from Clock Tower
  const distanceKm = useMemo(() => {
    return calculateDistanceKm(
      VIRAJPET_HUB.lat,
      VIRAJPET_HUB.lng,
      currentLat,
      currentLng
    );
  }, [currentLat, currentLng]);

  const isStandardDelivery = distanceKm <= VIRAJPET_HUB.standardRadiusKm;
  const isExtendedDelivery = distanceKm > VIRAJPET_HUB.standardRadiusKm && distanceKm <= VIRAJPET_HUB.maxRadiusKm;

  // Filter localities based on search
  const filteredLocalities = useMemo(() => {
    if (!localitySearch.trim()) return VIRAJPET_LOCALITIES.slice(0, 8);
    const q = localitySearch.toLowerCase();
    return VIRAJPET_LOCALITIES.filter(
      l => l.name.toLowerCase().includes(q) || l.landmarks.toLowerCase().includes(q)
    );
  }, [localitySearch]);

  // 1. Try Google Maps if API key is present
  useEffect(() => {
    if (!apiKey) {
      setProvider('leaflet');
      return;
    }

    if (window.google && window.google.maps) {
      setGoogleLoaded(true);
      setProvider('google');
      return;
    }

    // Listen for auth failure
    window.gm_authFailure = () => {
      console.warn('Google Maps API key authorization failed. Falling back to interactive Leaflet map.');
      setProvider('leaflet');
    };

    let script = document.getElementById('google-maps-sdk');
    if (!script) {
      script = document.createElement('script');
      script.id = 'google-maps-sdk';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleLoaded(true);
        setProvider('google');
      };
      script.onerror = () => {
        console.warn('Google Maps SDK failed to load. Falling back to Leaflet.');
        setProvider('leaflet');
      };
      document.head.appendChild(script);
    }
  }, [apiKey]);

  // 2. Load Leaflet when provider is leaflet
  useEffect(() => {
    if (provider !== 'leaflet') return;

    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    // Add Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Add Leaflet JS
    let script = document.getElementById('leaflet-js');
    if (!script) {
      script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      script.onerror = () => {
        console.warn('Leaflet script failed to load. Using interactive canvas view.');
        setProvider('canvas');
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setLeafletLoaded(true));
    }
  }, [provider]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (provider !== 'leaflet' || !leafletLoaded || !mapContainerRef.current || !window.L) return;

    // Clean up if already exists
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    try {
      const map = window.L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: zoom,
        zoomControl: false,
      });

      // Street Tile Layer (OpenStreetMap)
      const streetLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      });

      // Satellite Tile Layer (Esri World Imagery - high resolution & free)
      const satelliteLayer = window.L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '&copy; Esri World Imagery'
        }
      );

      // Add active tile layer
      if (mapType === 'satellite') {
        satelliteLayer.addTo(map);
        leafletTileLayerRef.current = satelliteLayer;
      } else {
        streetLayer.addTo(map);
        leafletTileLayerRef.current = streetLayer;
      }

      // Add 5.0 km Standard Delivery Boundary Circle around Virajpet Clock Tower
      window.L.circle([VIRAJPET_HUB.lat, VIRAJPET_HUB.lng], {
        color: '#10B981',
        fillColor: '#10B981',
        fillOpacity: 0.08,
        radius: VIRAJPET_HUB.standardRadiusKm * 1000,
        weight: 1.5,
        dashArray: '5 5'
      }).addTo(map);

      // Add 8.0 km Extended Delivery Boundary Circle
      window.L.circle([VIRAJPET_HUB.lat, VIRAJPET_HUB.lng], {
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.03,
        radius: VIRAJPET_HUB.maxRadiusKm * 1000,
        weight: 1.5,
        dashArray: '6 6'
      }).addTo(map);

      // Clock Tower Hub Marker
      const hubIcon = window.L.divIcon({
        className: 'hub-pin-icon',
        html: `<div style="background:#380611;color:#FAF5EC;border-radius:9999px;padding:3px 8px;font-size:10px;font-weight:900;border:1.5px solid #E4D5BF;box-shadow:0 2px 4px rgba(0,0,0,0.3);white-space:nowrap;display:flex;align-items:center;gap:3px;transform:translate(-50%, -50%);">
          <span>🕒 Virajpet Clock Tower</span>
        </div>`,
        iconSize: [120, 24],
        iconAnchor: [0, 0]
      });
      window.L.marker([VIRAJPET_HUB.lat, VIRAJPET_HUB.lng], { icon: hubIcon, interactive: false }).addTo(map);

      // Delivery Destination Pin (Draggable)
      const deliveryPinIcon = window.L.divIcon({
        className: 'delivery-pin-icon',
        html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%, -100%);cursor:grab;">
          <div style="background:#58111E;color:#FFFFFF;padding:8px;border-radius:9999px;border:2.5px solid #FFFFFF;box-shadow:0 8px 16px rgba(88,17,30,0.5);display:flex;align-items:center;justify-content:center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div style="width:8px;height:3px;background:rgba(0,0,0,0.4);border-radius:9999px;filter:blur(1px);margin-top:2px;"></div>
        </div>`,
        iconSize: [32, 40],
        iconAnchor: [0, 0]
      });

      const marker = window.L.marker([currentLat, currentLng], {
        draggable: true,
        icon: deliveryPinIcon,
        title: 'Delivery Pin (Drag or tap map to set location)'
      }).addTo(map);

      // Handle marker drag
      marker.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        handleCoordinatesChange(newPos.lat, newPos.lng);
      });

      // Handle map click
      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        handleCoordinatesChange(e.latlng.lat, e.latlng.lng);
      });

      leafletMapRef.current = map;
      leafletMarkerRef.current = marker;
    } catch (err) {
      console.warn('Leaflet initialization error:', err);
      setProvider('canvas');
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [provider, leafletLoaded]);

  // 4. Update Leaflet Map Layer when mapType changes
  useEffect(() => {
    if (provider !== 'leaflet' || !leafletMapRef.current || !window.L) return;

    if (leafletTileLayerRef.current) {
      leafletMapRef.current.removeLayer(leafletTileLayerRef.current);
    }

    const newLayer = mapType === 'satellite'
      ? window.L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 19, attribution: '&copy; Esri World Imagery' }
        )
      : window.L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }
        );

    newLayer.addTo(leafletMapRef.current);
    leafletTileLayerRef.current = newLayer;
  }, [mapType, provider]);

  // 5. Sync coordinates change to Leaflet Map instance
  useEffect(() => {
    if (provider !== 'leaflet' || !leafletMapRef.current || !leafletMarkerRef.current) return;
    const currentMarkerPos = leafletMarkerRef.current.getLatLng();
    if (
      Math.abs(currentMarkerPos.lat - currentLat) > 0.0001 ||
      Math.abs(currentMarkerPos.lng - currentLng) > 0.0001
    ) {
      leafletMarkerRef.current.setLatLng([currentLat, currentLng]);
      leafletMapRef.current.panTo([currentLat, currentLng], { animate: true });
    }
  }, [currentLat, currentLng, provider]);

  // 6. Initialize Google Maps JS API (if Google is provider)
  useEffect(() => {
    if (provider !== 'google' || !googleLoaded || !mapContainerRef.current || !window.google) return;

    const initialPos = { lat: currentLat, lng: currentLng };

    googleMapRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center: initialPos,
      zoom: zoom,
      mapTypeId: mapType,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    googleMarkerRef.current = new window.google.maps.Marker({
      position: initialPos,
      map: googleMapRef.current,
      draggable: true,
      title: 'Your Delivery Location in Virajpete',
      animation: window.google.maps.Animation.DROP,
    });

    googleMapRef.current.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      googleMarkerRef.current.setPosition({ lat, lng });
      handleCoordinatesChange(lat, lng);
    });

    googleMarkerRef.current.addListener('dragend', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handleCoordinatesChange(lat, lng);
    });
  }, [provider, googleLoaded]);

  // Sync Google Map type
  useEffect(() => {
    if (provider === 'google' && googleMapRef.current) {
      googleMapRef.current.setMapTypeId(mapType);
    }
  }, [mapType, provider]);

  // Sync Google Map position
  useEffect(() => {
    if (provider === 'google' && googleMapRef.current && googleMarkerRef.current) {
      const newPos = { lat: currentLat, lng: currentLng };
      googleMarkerRef.current.setPosition(newPos);
      googleMapRef.current.panTo(newPos);
    }
  }, [currentLat, currentLng, provider]);

  // Coordinate change dispatcher
  const handleCoordinatesChange = (rawLat, rawLng) => {
    const lat = Number(Number(rawLat).toFixed(4));
    const lng = Number(Number(rawLng).toFixed(4));
    if (onChangeCoords) {
      onChangeCoords({ lat, lng });
    }
  };

  // Select a preset locality
  const handleSelectLocality = (locality) => {
    handleCoordinatesChange(locality.lat, locality.lng);
    if (onSelectArea) {
      onSelectArea(locality.name, locality);
    }
    setShowLocalityPicker(false);

    // Pan map directly
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([locality.lat, locality.lng], 16, { animate: true });
    } else if (googleMapRef.current) {
      googleMapRef.current.setZoom(16);
      googleMapRef.current.panTo({ lat: locality.lat, lng: locality.lng });
    }
  };

  // Zoom controls
  const handleZoom = (delta) => {
    const newZoom = Math.max(12, Math.min(19, zoom + delta));
    setZoom(newZoom);
    if (leafletMapRef.current) {
      leafletMapRef.current.setZoom(newZoom);
    } else if (googleMapRef.current) {
      googleMapRef.current.setZoom(newZoom);
    }
  };

  // Reset to Clock Tower
  const handleResetToClockTower = () => {
    handleCoordinatesChange(VIRAJPET_HUB.lat, VIRAJPET_HUB.lng);
    if (onSelectArea) {
      onSelectArea(VIRAJPET_HUB.name);
    }
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([VIRAJPET_HUB.lat, VIRAJPET_HUB.lng], 15, { animate: true });
    } else if (googleMapRef.current) {
      googleMapRef.current.setZoom(15);
      googleMapRef.current.panTo({ lat: VIRAJPET_HUB.lat, lng: VIRAJPET_HUB.lng });
    }
  };

  // GPS Device Locator
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setGpsMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      return;
    }

    setIsLocating(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));

        handleCoordinatesChange(lat, lng);

        const dist = calculateDistanceKm(VIRAJPET_HUB.lat, VIRAJPET_HUB.lng, lat, lng);
        if (dist <= 8.0) {
          setGpsMessage({
            type: 'success',
            text: `GPS Acquired: ${dist.toFixed(1)} km from Clock Tower`
          });
        } else {
          setGpsMessage({
            type: 'warning',
            text: `GPS located (${dist.toFixed(1)} km away). Outside Virajpet 5 km core radius.`
          });
        }

        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([lat, lng], 16);
        } else if (googleMapRef.current) {
          googleMapRef.current.setZoom(16);
          googleMapRef.current.panTo({ lat, lng });
        }
      },
      (err) => {
        setIsLocating(false);
        setGpsMessage({
          type: 'error',
          text: err.code === 1 ? 'Location permission was denied.' : 'Unable to acquire GPS signal.'
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3">
      
      {/* Search & Quick Locality Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Virajpet locality (e.g. Arasikatte, Maletirike, Telugubedha)..."
            value={localitySearch}
            onChange={(e) => {
              setLocalitySearch(e.target.value);
              setShowLocalityPicker(true);
            }}
            onFocus={() => setShowLocalityPicker(true)}
            className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] text-[#380611] outline-hidden placeholder:text-[#7E6569]"
          />
          <Search className="w-3.5 h-3.5 text-[#7E6569] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <button
          type="button"
          onClick={() => setShowLocalityPicker(!showLocalityPicker)}
          className="px-3 py-2 bg-[#FAF5EC] hover:bg-[#F0E6D6] text-[#58111E] font-bold text-xs rounded-xl border border-[#F0E6D6] transition-colors shrink-0"
        >
          {showLocalityPicker ? 'Hide Areas' : 'Popular Virajpet Localities ▾'}
        </button>
      </div>

      {/* Dropdown / Grid of Virajpet Localities */}
      {showLocalityPicker && (
        <div className="p-3 bg-white rounded-2xl border border-[#F0E6D6] shadow-md space-y-2 max-h-48 overflow-y-auto animate-in fade-in">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#7E6569]">
            <span>Click any area to jump pin &amp; autofill:</span>
            <span className="text-[10px] text-[#58111E]">{filteredLocalities.length} areas found</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {filteredLocalities.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectLocality(loc)}
                className="text-left p-2 rounded-xl border border-[#F0E6D6] hover:border-[#58111E] hover:bg-[#FAF5EC] transition-all group"
              >
                <div className="text-xs font-bold text-[#380611] group-hover:text-[#58111E] truncate">
                  {loc.name}
                </div>
                <div className="text-[10px] text-[#7E6569] flex items-center justify-between mt-0.5">
                  <span className="truncate">{loc.category}</span>
                  <span className="font-mono text-[#58111E] font-semibold">{loc.approxDistanceKm} km</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GPS Status Notification Banner */}
      {gpsMessage && (
        <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 animate-in fade-in ${
          gpsMessage.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            : gpsMessage.type === 'warning'
            ? 'bg-amber-50 border border-amber-200 text-amber-900'
            : 'bg-rose-50 border border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            {gpsMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : gpsMessage.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{gpsMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setGpsMessage(null)}
            className="text-[11px] font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Interactive Map Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#F0E6D6] shadow-sm bg-[#FAF5EC]">
        
        {/* Real Interactive Map Canvas */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-72 sm:h-80 relative z-0 focus:outline-none"
          tabIndex={0}
        />

        {/* Fallback Static Radar Canvas if offline / scripts blocked */}
        {provider === 'canvas' && (
          <div className="absolute inset-0 bg-[#FAF5EC] flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
            <div className="w-12 h-12 rounded-full bg-[#58111E]/10 text-[#58111E] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#58111E]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#380611]">Virajpet Pin Set</h4>
              <p className="text-xs text-[#7E6569]">
                Coordinates: {currentLat}° N, {currentLng}° E ({distanceKm} km from Clock Tower)
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              <button
                type="button"
                onClick={handleResetToClockTower}
                className="px-3 py-1.5 bg-[#58111E] text-white text-xs font-bold rounded-xl"
              >
                Center at Clock Tower
              </button>
              <button
                type="button"
                onClick={() => setProvider('leaflet')}
                className="px-3 py-1.5 bg-white border border-[#F0E6D6] text-[#380611] text-xs font-bold rounded-xl"
              >
                Retry Map Tiles
              </button>
            </div>
          </div>
        )}

        {/* Floating Top Controls: Locate GPS & Map/Satellite Mode */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto z-20">
          <button
            type="button"
            onClick={handleUseGPS}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-[#58111E] font-bold text-xs rounded-xl shadow-md border border-[#F0E6D6] backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Detect GPS location from device"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#58111E] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Locate My GPS'}</span>
          </button>

          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#F0E6D6] shadow-md text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                mapType === 'roadmap' ? 'bg-[#58111E] text-white shadow-xs' : 'text-[#7E6569] hover:text-[#380611]'
              }`}
            >
              Street
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                mapType === 'satellite' ? 'bg-[#58111E] text-white shadow-xs' : 'text-[#7E6569] hover:text-[#380611]'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Floating Zoom & Hub Reset Controls (Right Side) */}
        <div className="absolute bottom-14 right-3 flex flex-col gap-1.5 z-20">
          <button
            type="button"
            onClick={() => handleZoom(1)}
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-[#380611] font-bold shadow-md border border-[#F0E6D6] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-1)}
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-[#380611] font-bold shadow-md border border-[#F0E6D6] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetToClockTower}
            className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-[#58111E] font-bold shadow-md border border-[#F0E6D6] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Reset Pin to Clock Tower"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Tip Badge (Bottom Left) */}
        <div className="absolute bottom-14 left-3 pointer-events-none z-20">
          <span className="px-2.5 py-1 rounded-lg bg-[#380611]/85 text-[#FDFBF7] text-[10px] font-bold shadow-md backdrop-blur-md">
            Tap anywhere or drag pin
          </span>
        </div>

        {/* Bottom Status Bar: Distance & Delivery Feasibility */}
        <div className="p-3 bg-white border-t border-[#F0E6D6] flex flex-wrap items-center justify-between gap-2 text-xs relative z-20">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              isStandardDelivery ? 'bg-emerald-500' : isExtendedDelivery ? 'bg-amber-500' : 'bg-rose-500'
            }`} />
            <span className="font-bold text-[#380611]">
              {selectedArea || 'Virajpet Location'}:
            </span>
            <span className="font-mono font-semibold text-[#7E6569]">
              {distanceKm} km from Clock Tower
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isStandardDelivery 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : isExtendedDelivery 
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}>
              {isStandardDelivery
                ? '✓ 25-35 Min Standard Delivery (₹35 / Free > ₹499)'
                : isExtendedDelivery
                ? '📍 Extended Surrounding Zone'
                : '⚠ Outside Core Area'}
            </span>

            <a
              href={`https://maps.google.com/?q=${currentLat},${currentLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58111E] hover:underline flex items-center gap-1 text-[11px] font-bold"
              title="Open coordinates in external Google Maps"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
