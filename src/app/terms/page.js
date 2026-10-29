import React from 'react';

export const metadata = {
  title: 'Terms of Service — BeeGo Delivery Virajpete',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-500 mt-1">Platform Rules &amp; User Agreement for Virajpete, Kodagu</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Service Area &amp; Coverage</h2>
          <p>
            BeeGo operates exclusively within designated hyperlocal boundaries in Virajpete, Kodagu, Karnataka (standard 5 km delivery radius from Virajpete Clock Tower). Orders outside the active geofence are subject to cancellation or custom dispatch rates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Merchant Fulfillment</h2>
          <p>
            BeeGo operates as a technology facilitator connecting consumers with registered merchants, restaurants, supermarkets, and licensed pharmacies in Virajpete. Product descriptions, availability, and packaging are managed by respective merchants.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Regulated Products &amp; Medicines</h2>
          <p>
            Sale of pharmaceutical items under Schedule H and Schedule X strictly complies with Indian drug laws. Valid doctor prescriptions must be verified prior to dispatch.
          </p>
        </section>
      </div>
    </div>
  );
}

