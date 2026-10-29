'use client';

import React, { useState } from 'react';
import { Tag, Plus, CheckCircle, Percent } from 'lucide-react';

const INITIAL_COUPONS_LIST = [
  {
    code: 'BEEGO50',
    description: 'Flat ₹50 OFF on orders above ₹199',
    type: 'fixed',
    value: 50,
    minOrder: 199,
    isActive: true,
  },
  {
    code: 'FIRSTORDER',
    description: '20% OFF on your first Virajpete order',
    type: 'percentage',
    value: 20,
    minOrder: 149,
    isActive: true,
  },
  {
    code: 'FREESHIP',
    description: 'Free Delivery for orders above ₹299',
    type: 'fixed',
    value: 35,
    minOrder: 299,
    isActive: true,
  },
];

export default function AdminPromotionsPage() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS_LIST);
  const [showAdd, setShowAdd] = useState(false);
  const [code, setCode] = useState('');
  const [discountVal, setDiscountVal] = useState('');
  const [minOrder, setMinOrder] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setCoupons([
      {
        code: code.trim().toUpperCase(),
        description: `Promo discount: ₹${discountVal} off`,
        type: 'fixed',
        value: parseFloat(discountVal) || 20,
        minOrder: parseFloat(minOrder) || 100,
        isActive: true,
      },
      ...coupons,
    ]);
    setShowAdd(false);
    setCode('');
    setDiscountVal('');
    setMinOrder('');
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Promotions &amp; Coupons
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage genuine discount vouchers and free delivery promotions for Virajpete
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.code} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                {c.code}
              </span>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-600">{c.description}</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
              <span>Min Order: ₹{c.minOrder}</span>
              <strong className="text-slate-900">
                {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Create New Coupon Code</h2>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COORGDEAL"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Discount Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="40"
                    value={discountVal}
                    onChange={(e) => setDiscountVal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Min Order (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="199"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

