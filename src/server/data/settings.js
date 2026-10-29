import fs from 'fs';
import path from 'path';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src', 'server', 'data', 'settings.json');

const DEFAULT_SETTINGS = {
  platformName: 'BeeGo Delivery',
  tagline: 'We deliver you.',
  hubLocation: 'Virajpete, Kodagu, Karnataka',
  hubOpen: true,
  baseDeliveryFee: 35.00,
  freeDeliveryThreshold: 499.00,
  deliveryRadiusKm: 5.0,
  whatsappNumber: '918277000000',
  whatsappDisplay: '+91 82770 00000',
  operatingHours: '07:00 AM - 10:30 PM',
  announcement: {
    enabled: true,
    text: '🐝 Express Hyperlocal Delivery across Virajpete Town! Direct WhatsApp ordering active.',
    type: 'info', // 'info' | 'warning' | 'success'
  },
  updatedAt: new Date().toISOString(),
};

let inMemorySettingsCache = null;

export function readStoredSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const data = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        inMemorySettingsCache = { ...DEFAULT_SETTINGS, ...parsed };
        return inMemorySettingsCache;
      }
    }
  } catch (err) {
    console.warn('readStoredSettings fallback to defaults:', err.message);
  }

  if (!inMemorySettingsCache) {
    inMemorySettingsCache = { ...DEFAULT_SETTINGS };
    // Try to write default settings file
    try {
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    } catch (e) {
      // Ignored
    }
  }
  return inMemorySettingsCache;
}

export function writeStoredSettings(newSettings) {
  try {
    const current = readStoredSettings();
    const updated = {
      ...current,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    inMemorySettingsCache = updated;
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (err) {
    console.error('writeStoredSettings error:', err.message);
    return null;
  }
}

export async function getSettings() {
  return readStoredSettings();
}

export async function updateSettings(settings) {
  return writeStoredSettings(settings);
}

