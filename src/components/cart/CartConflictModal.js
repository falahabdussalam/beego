'use client';

import React from 'react';
import { AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartConflictModal() {
  const { conflictModal, resolveConflict } = useCart();

  if (!conflictModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Replace cart items?
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Your cart currently contains items from{' '}
              <span className="font-semibold text-slate-900">
                "{conflictModal.currentStoreName}"
              </span>
              . Do you want to discard your previous selection and start an order from{' '}
              <span className="font-semibold text-amber-600">
                "{conflictModal.newStoreName}"
              </span>
              ?
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            BeeGo operates on a dedicated single-store delivery policy to guarantee fresh, fast, and direct delivery across Virajpete.
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={() => resolveConflict(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Keep Previous
          </button>
          <button
            onClick={() => resolveConflict(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow-sm transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard & Add New</span>
          </button>
        </div>
      </div>
    </div>
  );
}

