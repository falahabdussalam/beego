/**
 * Verified Virajpete Merchant Stores
 * Dynamic persistence in stores.json
 */

import fs from 'fs';
import path from 'path';

export const INITIAL_STORES = [
  {
    id: 'store_coorg_heritage',
    name: 'Coorg Heritage Kitchen',
    type: 'Restaurant',
    categoryName: 'Food & Dining',
    address: 'Near Clock Tower, Main Road, Virajpete',
    lat: 12.2041,
    lng: 75.8039,
    rating: 4.9,
    deliveryTimeMinutes: '25-30',
    distanceKm: 0.6,
    minOrderAmount: 150,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257111',
  },
  {
    id: 'store_viraj_provisions',
    name: 'Virajpet Central Super Store',
    type: 'Supermarket',
    categoryName: 'Grocery & Essentials',
    address: 'Market Road, Telugubedha, Virajpete',
    lat: 12.2065,
    lng: 75.8021,
    rating: 4.8,
    deliveryTimeMinutes: '20-25',
    distanceKm: 0.8,
    minOrderAmount: 99,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257222',
  },
  {
    id: 'store_city_pharmacy',
    name: 'City Care Licensed Pharmacy',
    type: 'Pharmacy',
    categoryName: 'Pharmacy & Healthcare',
    address: 'Opposite Government Hospital Road, Virajpete',
    lat: 12.2025,
    lng: 75.8055,
    rating: 4.9,
    deliveryTimeMinutes: '15-20',
    distanceKm: 0.4,
    minOrderAmount: 50,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257333',
    licenseNumber: 'KA-KOD-2024-DRUG-0482',
  },
  {
    id: 'store_nandini_parlour',
    name: 'Nandini Milk Parlour & Dairy',
    type: 'Dairy',
    categoryName: 'Milk & Fresh Dairy',
    address: 'Bus Stand Junction, Virajpete',
    lat: 12.2050,
    lng: 75.8048,
    rating: 4.8,
    deliveryTimeMinutes: '15-25',
    distanceKm: 0.5,
    minOrderAmount: 40,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257444',
  },
  {
    id: 'store_maletirike_greens',
    name: 'Maletirike Fresh Farm Produce',
    type: 'Produce',
    categoryName: 'Fruits & Vegetables',
    address: 'Maletirike Road, Virajpete',
    lat: 12.2070,
    lng: 75.8120,
    rating: 4.7,
    deliveryTimeMinutes: '20-30',
    distanceKm: 1.1,
    minOrderAmount: 80,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257555',
  },
  {
    id: 'store_royal_bakery',
    name: 'Royal Bakery & Coorg Coffee Bar',
    type: 'Bakery & Cafe',
    categoryName: 'Beverages & Snacks',
    address: 'Clock Tower Circle, Virajpete',
    lat: 12.2038,
    lng: 75.8035,
    rating: 4.9,
    deliveryTimeMinutes: '20-25',
    distanceKm: 0.2,
    minOrderAmount: 100,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257666',
  },
];

const STORES_FILE_PATH = path.join(process.cwd(), 'src', 'server', 'data', 'stores.json');

let inMemoryStoresCache = null;

export function readStoredStores() {
  try {
    if (fs.existsSync(STORES_FILE_PATH)) {
      const data = fs.readFileSync(STORES_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryStoresCache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('readStoredStores fallback to memory:', err.message);
  }

  // Initialize file if not found or empty
  if (!inMemoryStoresCache) {
    inMemoryStoresCache = [...INITIAL_STORES];
    try {
      fs.writeFileSync(STORES_FILE_PATH, JSON.stringify(INITIAL_STORES, null, 2), 'utf-8');
    } catch (e) {
      // Ignored
    }
  }
  return inMemoryStoresCache;
}

export function writeStoredStores(stores) {
  try {
    inMemoryStoresCache = stores;
    fs.writeFileSync(STORES_FILE_PATH, JSON.stringify(stores, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('writeStoredStores error:', err.message);
    return false;
  }
}

export async function getAllStores() {
  return readStoredStores();
}

export async function getStoreById(id) {
  const stores = readStoredStores();
  return stores.find((s) => s.id === id) || null;
}

export async function saveStore(storeData) {
  const stores = readStoredStores();
  const id = storeData.id || `store_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newStore = {
    id,
    name: storeData.name,
    type: storeData.type || 'Merchant',
    categoryName: storeData.categoryName || 'General',
    address: storeData.address || 'Virajpete, Kodagu',
    lat: Number(storeData.lat) || 12.2039,
    lng: Number(storeData.lng) || 75.8037,
    rating: Number(storeData.rating) || 4.8,
    deliveryTimeMinutes: storeData.deliveryTimeMinutes || '20-30',
    distanceKm: Number(storeData.distanceKm) || 0.8,
    minOrderAmount: Number(storeData.minOrderAmount) || 50,
    isOpen: storeData.isOpen !== undefined ? Boolean(storeData.isOpen) : true,
    image: storeData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    phone: storeData.phone || '+91 8274 257000',
    licenseNumber: storeData.licenseNumber || null,
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = stores.findIndex((s) => s.id === id);
  if (existingIndex >= 0) {
    stores[existingIndex] = { ...stores[existingIndex], ...newStore };
  } else {
    stores.push(newStore);
  }

  writeStoredStores(stores);
  return newStore;
}

export async function toggleStoreStatus(id) {
  const stores = readStoredStores();
  const store = stores.find((s) => s.id === id);
  if (!store) return null;

  store.isOpen = !store.isOpen;
  store.updatedAt = new Date().toISOString();
  writeStoredStores(stores);
  return store;
}
