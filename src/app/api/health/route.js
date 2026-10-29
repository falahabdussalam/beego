import { testConnection } from '../../../server/db/client';

export async function GET() {
  const isDbConnected = await testConnection();

  return Response.json({
    status: 'healthy',
    platform: 'BeeGo Delivery',
    tagline: 'We deliver you.',
    location: 'Virajpete, Kodagu, Karnataka, India',
    coordinates: {
      lat: 12.2039,
      lng: 75.8037,
      radiusKm: 5.0,
    },
    database: isDbConnected ? 'postgresql_connected' : 'development_memory_store',
    timestamp: new Date().toISOString(),
  });
}

