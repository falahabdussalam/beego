'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Megaphone, 
  Truck, 
  Phone, 
  MapPin, 
  Save, 
  ExternalLink,
  Power,
  Sparkles,
  Info
} from 'lucide-react';
import { broadcastSyncEvent } from '../../../lib/sync';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [form, setForm] = useState({
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
      type: 'info',
    },
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setForm((prev) => ({
            ...prev,
            ...data.settings,
            announcement: {
              ...prev.announcement,
              ...(data.settings.announcement || {}),
            },
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const payload = {
        platformName: form.platformName,
        tagline: form.tagline,
        hubLocation: form.hubLocation,
        hubOpen: Boolean(form.hubOpen),
        baseDeliveryFee: Number(form.baseDeliveryFee) || 35.00,
        freeDeliveryThreshold: Number(form.freeDeliveryThreshold) || 499.00,
        deliveryRadiusKm: Number(form.deliveryRadiusKm) || 5.0,
        whatsappNumber: form.whatsappNumber.trim(),
        whatsappDisplay: form.whatsappDisplay.trim(),
        operatingHours: form.operatingHours.trim(),
        announcement: {
          enabled: Boolean(form.announcement?.enabled),
          text: form.announcement?.text?.trim() || '',
          type: form.announcement?.type || 'info',
        },
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update settings');
      }

      const data = await res.json();
      setStatusMessage({
        type: 'success',
        text: 'Platform settings saved! Changes are immediately live across the customer site.',
      });
      broadcastSyncEvent('SETTINGS_UPDATED', data.settings);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#380611] tracking-tight">
            Platform &amp; Delivery Settings
          </h1>
          <p className="text-xs text-[#7E6569] mt-1">
            Configure delivery fees, free delivery rules, WhatsApp dispatch numbers, and live customer announcements
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchSettings}
            className="p-2.5 rounded-xl border border-[#F0E6D6] bg-white text-[#58111E] hover:bg-[#FAF5EC] transition-colors shadow-2xs"
            title="Reload Settings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF5EC] hover:bg-white text-[#58111E] border border-[#F0E6D6] font-bold text-xs rounded-xl transition-all"
          >
            <span>Preview Customer Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Status Toast */}
      {statusMessage.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border animate-in fade-in ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
          <button 
            onClick={() => setStatusMessage({ type: '', text: '' })} 
            className="text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Live Customer Announcement Banner */}
        <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E6D6] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#58111E] text-white flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#380611]">Customer Site Announcement Banner</h2>
                <p className="text-[11px] text-[#7E6569]">Broadcast messages directly to top of customer website</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.announcement?.enabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcement: { ...form.announcement, enabled: e.target.checked },
                  })
                }
                className="rounded text-[#58111E] focus:ring-[#58111E] w-4 h-4"
              />
              <span className="text-xs font-bold text-[#380611]">
                {form.announcement?.enabled ? 'Banner Active' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                Announcement Message Text
              </label>
              <textarea
                rows={2}
                value={form.announcement?.text || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcement: { ...form.announcement, text: e.target.value },
                  })
                }
                placeholder="e.g. 🐝 Virajpete Express: 25-35 min delivery across Virajpete! Order easily via WhatsApp."
                className="w-full p-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] outline-hidden text-[#380611]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                Banner Style / Alert Level
              </label>
              <select
                value={form.announcement?.type || 'info'}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcement: { ...form.announcement, type: e.target.value },
                  })
                }
                className="text-xs p-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] text-[#380611] font-medium outline-hidden w-full sm:w-60"
              >
                <option value="info">BeeGo Burgundy (Standard Info)</option>
                <option value="warning">Amber (Weather / Delay Alert)</option>
                <option value="success">Emerald (Promotions / Discounts)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Hyperlocal Delivery Rules */}
        <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#F0E6D6] pb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center border border-[#F0E6D6]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#380611]">Virajpete Delivery &amp; Pricing Policies</h2>
              <p className="text-[11px] text-[#7E6569]">Configure rates applied during customer cart calculation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                Base Delivery Fee (₹)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={form.baseDeliveryFee}
                onChange={(e) => setForm({ ...form, baseDeliveryFee: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] outline-hidden text-[#380611]"
              />
              <span className="text-[10px] text-[#7E6569] mt-1 block">Default fee when below threshold</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                Free Delivery Subtotal (₹)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={form.freeDeliveryThreshold}
                onChange={(e) => setForm({ ...form, freeDeliveryThreshold: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] outline-hidden text-[#380611]"
              />
              <span className="text-[10px] text-[#7E6569] mt-1 block">Orders above this get free delivery</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                Geofence Radius (km)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="25"
                required
                value={form.deliveryRadiusKm}
                onChange={(e) => setForm({ ...form, deliveryRadiusKm: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] outline-hidden text-[#380611]"
              />
              <span className="text-[10px] text-[#7E6569] mt-1 block">From Virajpete Clock Tower center</span>
            </div>
          </div>
        </div>

        {/* 3. WhatsApp Dispatch Numbers */}
        <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#F0E6D6] pb-3">
            <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#128C7E]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#380611]">WhatsApp Order Receiving Numbers</h2>
              <p className="text-[11px] text-[#7E6569]">Desk number where customer order messages are delivered</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                WhatsApp API Number (Country Code + Number)
              </label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                placeholder="918277000000"
                className="w-full p-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] outline-hidden text-[#380611]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                Display Format for Customers
              </label>
              <input
                type="text"
                required
                value={form.whatsappDisplay}
                onChange={(e) => setForm({ ...form, whatsappDisplay: e.target.value })}
                placeholder="+91 82770 00000"
                className="w-full p-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] outline-hidden text-[#380611]"
              />
            </div>
          </div>
        </div>

        {/* 4. Operating Status */}
        <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center border border-[#F0E6D6]">
                <Power className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#380611]">Virajpete Hub Operational Status</h2>
                <p className="text-[11px] text-[#7E6569]">When paused, orders cannot be placed by customers</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hubOpen}
                onChange={(e) => setForm({ ...form, hubOpen: e.target.checked })}
                className="rounded text-[#58111E] focus:ring-[#58111E] w-4 h-4"
              />
              <span className={`text-xs font-bold ${form.hubOpen ? 'text-emerald-700' : 'text-rose-700'}`}>
                {form.hubOpen ? '● Hub Accepting Orders' : '✕ Hub Temporarily Paused'}
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save & Broadcast Changes Live'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

