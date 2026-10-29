import React from 'react';

export const metadata = {
  title: 'Cancellation & Refund Policy — BeeGo Delivery Virajpete',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Cancellation &amp; Refund Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">Customer Fair Usage Guidelines • Virajpete Hub</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Order Cancellation Window</h2>
          <p>
            Customers may cancel an order free of charge while the order is in the <strong>"Order Placed"</strong> status. Once a restaurant or store begins food preparation or items have been packed (status <strong>"Preparing"</strong> or beyond), cancellations are subject to merchant approval.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Refund Processing Time</h2>
          <p>
            For prepaid orders cancelled within eligibility, refunds are initiated immediately to the original payment source and settle within 3-5 business days as per Indian banking guidelines. For Cash on Delivery orders, no charges apply.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Damaged or Missing Items</h2>
          <p>
            If any item delivered is damaged, spoiled, or missing, please report the issue within 2 hours of delivery via our Virajpete customer care line (+91 8274 256789) or in-app support for an instant replacement or refund credit.
          </p>
        </section>
      </div>
    </div>
  );
}

