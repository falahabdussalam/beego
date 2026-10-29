import React from 'react';

export const metadata = {
  title: 'Privacy Policy — BeeGo Delivery Virajpete',
  description: 'Privacy Policy and data protection terms for BeeGo Delivery in Virajpete, Kodagu, Karnataka.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#380611] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#7A162D]/70 mt-1">
          Effective Date: October 2026 • BeeGo Hyperlocal Delivery, Virajpete, Kodagu
        </p>
      </div>

      <div className="bg-[#FAF5EC] rounded-3xl p-8 border border-[#F0E6D6] shadow-2xs space-y-6 text-xs sm:text-sm text-[#380611] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#380611]">1. Information We Collect</h2>
          <p className="text-[#7A162D]/90">
            BeeGo collects personal information strictly required to facilitate hyperlocal delivery services in Virajpete, Kodagu, including your name, delivery address coordinates (latitude and longitude), mobile phone number, order preferences, and encrypted authentication credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#380611]">2. Geolocation Data</h2>
          <p className="text-[#7A162D]/90">
            We collect real-time device location only after explicit customer permission to verify delivery geofence serviceability within our configured 5 km radius of Virajpete town. Location data is never shared with third parties or sold.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#380611]">3. Pharmacy and Prescription Data</h2>
          <p className="text-[#7A162D]/90">
            In compliance with Indian pharmacy regulations and the Drugs and Cosmetics Act (1940), prescription records submitted for Schedule H medications are securely transmitted exclusively to licensed dispensing pharmacies in Virajpete and maintained strictly in accordance with statutory medical privacy standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#380611]">4. WhatsApp &amp; Order Security</h2>
          <p className="text-[#7A162D]/90">
            Order communication over WhatsApp is end-to-end encrypted. BeeGo systems log order metadata to maintain fulfillment accuracy and assist local Virajpete merchants with timely delivery.
          </p>
        </section>
      </div>
    </div>
  );
}
