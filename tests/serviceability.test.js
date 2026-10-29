import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceKm } from '../src/lib/geo.js';
import { searchCatalog } from '../src/server/data/catalog.js';

test('Serviceability geofence distance calculation for Virajpete', () => {
  const virajpetHub = { lat: 12.2039, lng: 75.8037 };

  // Center distance should be ~0
  const centerDist = calculateDistanceKm(virajpetHub.lat, virajpetHub.lng, virajpetHub.lat, virajpetHub.lng);
  assert.ok(centerDist < 0.01);

  // Telugubedha (~0.5 km)
  const telugubedhaDist = calculateDistanceKm(virajpetHub.lat, virajpetHub.lng, 12.2085, 75.8015);
  assert.ok(telugubedhaDist < 1.0);
  assert.ok(telugubedhaDist <= 5.0, 'Telugubedha should be well within the 5 km delivery radius');

  // Madikeri (~30 km away)
  const madikeriDist = calculateDistanceKm(virajpetHub.lat, virajpetHub.lng, 12.4244, 75.7382);
  assert.ok(madikeriDist > 20.0, 'Madikeri is outside the Virajpete 5 km delivery radius');
});

test('Search catalog query matching', async () => {
  const sampleCatalog = [
    { id: 'test_coffee', name: 'Coorg Special Coffee', categoryId: 'beverages-snacks', price: 150 },
    { id: 'test_med', name: 'Paracetamol 650 Tablets', categoryId: 'pharmacy-medicines', price: 30 },
  ];
  const coffeeResults = await searchCatalog('coffee', 'all', 'popular', sampleCatalog);
  assert.ok(coffeeResults.length > 0);
  assert.ok(coffeeResults.some((p) => p.name.toLowerCase().includes('coffee')));

  const pharmacyResults = await searchCatalog('', 'pharmacy-medicines', 'popular', sampleCatalog);
  assert.ok(pharmacyResults.length > 0);
  assert.ok(pharmacyResults.every((p) => p.categoryId === 'pharmacy-medicines'));
});
