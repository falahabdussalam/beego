'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export const VIRAJPET_DEFAULT_COORDS = {
  lat: 12.2039,
  lng: 75.8037,
  name: 'Virajpete Town',
  area: 'Clock Tower & Main Market',
  landmark: 'Near Clock Tower',
  city: 'Virajpete',
  district: 'Kodagu',
  state: 'Karnataka',
  pincode: '571218',
  formattedAddress: 'Main Road, Clock Tower Area, Virajpete, Kodagu, Karnataka 571218',
  radiusKm: 5.0,
};

export function LocationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState(VIRAJPET_DEFAULT_COORDS);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [serviceable, setServiceable] = useState(true);

  // Hydrate saved location from localStorage on client load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('beego_user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentLocation(parsed);
      }
    } catch (e) {
      console.warn('Could not read saved location from localStorage', e);
    }
  }, []);

  const updateLocation = (newLoc) => {
    setCurrentLocation(newLoc);
    try {
      localStorage.setItem('beego_user_location', JSON.stringify(newLoc));
    } catch (e) {
      console.warn('Could not save location to localStorage', e);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        updateLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        serviceable,
        setServiceable,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return ctx;
}

