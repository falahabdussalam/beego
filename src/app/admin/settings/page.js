'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'BeeGo Delivery',
    tagline: 'We deliver you.',
    hubLocation: 'Virajpete, Kodagu, Karnataka',
    supportPhone: '+91 8274 256789',
    supportEmail: 'support@beegodelivery.in',
    enableCOD: true,
    enableRazorpaySandbox: true,
    requirePrescriptionUpload: true,
    deliveryFee: 35,
    freeDeliveryThreshold: 499,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure global business rules, payment gateways, and contact details</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Platform settings updated successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs max-w-3xl">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Support Phone</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Payment &amp; Compliance Toggles</h3>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableCOD}
                onChange={(e) => setSettings({ ...settings, enableCOD: e.target.checked })}
                className="rounded text-amber-500 w-4 h-4"
              />
              <span className="font-semibold text-slate-700">Enable Cash on Delivery (COD) in Virajpete</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableRazorpaySandbox}
                onChange={(e) => setSettings({ ...settings, enableRazorpaySandbox: e.target.checked })}
                className="rounded text-amber-500 w-4 h-4"
              />
              <span className="font-semibold text-slate-700">Enable Razorpay Sandbox / Online Gateway</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requirePrescriptionUpload}
                onChange={(e) => setSettings({ ...settings, requirePrescriptionUpload: e.target.checked })}
                className="rounded text-amber-500 w-4 h-4"
              />
              <span className="font-semibold text-slate-700">Enforce Schedule H Prescription Validation on regulated drugs</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Platform Settings</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

