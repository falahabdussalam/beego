import { query } from '../../../server/db/client';

const VIRAJPET_CENTER = {
  lat: 12.2039,
  lng: 75.8037,
};

function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');

    if (!latParam || !lngParam) {
      return Response.json(
        { error: 'Latitude (lat) and Longitude (lng) query parameters are required.' },
        { status: 400 }
      );
    }

    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return Response.json(
        { error: 'Invalid geographical coordinates provided.' },
        { status: 400 }
      );
    }

    // Check delivery zone from database or default
    let zoneRadiusKm = 5.0;
    let baseDeliveryFee = 35.0;
    let freeDeliveryThreshold = 499.0;
    let zoneName = 'Virajpete Central 5KM Zone';

    try {
      const zoneRes = await query(
        'SELECT * FROM delivery_zones WHERE is_active = true ORDER BY created_at ASC LIMIT 1'
      );
      if (zoneRes.rows && zoneRes.rows.length > 0) {
        const zone = zoneRes.rows[0];
        zoneRadiusKm = Number(zone.radius_km);
        baseDeliveryFee = Number(zone.base_delivery_fee);
        freeDeliveryThreshold = Number(zone.free_delivery_threshold);
        zoneName = zone.name;
      }
    } catch (e) {
      // Use defaults
    }

    const distanceKm = calculateHaversineKm(
      VIRAJPET_CENTER.lat,
      VIRAJPET_CENTER.lng,
      lat,
      lng
    );

    const isServiceable = distanceKm <= zoneRadiusKm;

    return Response.json({
      serviceable: isServiceable,
      distanceKm: Number(distanceKm.toFixed(2)),
      zoneName,
      maxRadiusKm: zoneRadiusKm,
      baseDeliveryFee,
      freeDeliveryThreshold,
      estimatedDeliveryMinutes: isServiceable
        ? distanceKm < 2.0
          ? '20-25 mins'
          : distanceKm < 3.5
          ? '25-30 mins'
          : '30-40 mins'
        : null,
      message: isServiceable
        ? `Delivering across ${zoneName} (${distanceKm.toFixed(1)} km from Virajpete Town Center).`
        : `Location is ${distanceKm.toFixed(1)} km away. This exceeds our active ${zoneRadiusKm} km delivery boundary for Virajpete.`,
      referenceCenter: {
        lat: VIRAJPET_CENTER.lat,
        lng: VIRAJPET_CENTER.lng,
        name: 'Clock Tower, Virajpete, Kodagu',
      },
    });
  } catch (error) {
    console.error('Serviceability calculation error:', error);
    return Response.json(
      { error: 'Failed to verify location serviceability.' },
      { status: 500 }
    );
  }
}

