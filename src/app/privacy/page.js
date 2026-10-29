import React from 'react';

export const metadata = {
  title: 'Privacy Policy — BeeGo Delivery Virajpete',
  description: 'Privacy Policy and data protection terms for BeeGo Delivery in Virajpete, Kodagu, Karnataka.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: October 2026 • BeeGo Hyperlocal Delivery, Virajpete, Kodagu
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            BeeGo collects personal information strictly required to facilitate hyperlocal delivery services in Virajpete, Kodagu, including your name, delivery address coordinates (latitude and longitude), mobile phone number, order preferences, and encrypted authentication credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Geolocation Data</h2>
          <p>
            We collect real-time device location only after explicit customer permission to verify delivery geofence serviceability within our configured 5 km radius of Virajpete town. Location data is never shared with third parties or sold.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Pharmacy and Prescription Data</h2>
          <p>
            In compliance with Indian pharmacy regulations and the Drugs and Cosmetics Act (1940), prescription records submitted for Schedule H medications are securely transmitted exclusively to licensed dispensing pharmacies in Virajpete and maintained strictly in accordance with statutory medical privacy standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Payment Security</h2>
          <p>
            Payment transactions are processed through certified payment gateway partners (e.g. Razorpay) or fulfilled via Cash on Delivery. BeeGo servers never store raw credit card numbers or UPI PINs.
          </p>
        </section>
      </div>
    </div>
  );
}

