'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Store, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Package, 
  RefreshCw,
  Power
} from 'lucide-react';

export default function StorePortalPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stockInputs, setStockInputs] = useState({});
  const [updatingStock, setUpdatingStock] = useState({});

  const fetchStoreData = () => {
    setLoading(true);
    fetch('/api/store-portal')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized or store not assigned');
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        // Initialize stock inputs
        const initial = {};
        (resData.inventory || []).forEach((p) => {
          initial[p.id] = p.stock;
        });
        setStockInputs(initial);
      })
      .catch((e) => console.warn(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const handleToggleStoreOpen = async () => {
    if (!data?.store) return;
    const newStatus = !data.store.isOpen;
    try {
      const res = await fetch('/api/store-portal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_open', isOpen: newStatus }),
      });
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          store: { ...prev.store, isOpen: newStatus },
        }));
      }
    } catch (e) {
      alert('Failed to update store open status');
    }
  };

  const handleSaveStock = async (productId) => {
    const val = stockInputs[productId];
    setUpdatingStock((prev) => ({ ...prev, [productId]: true }));

    try {
      const res = await fetch('/api/store-portal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_stock', productId, newStock: val }),
      });
      if (!res.ok) throw new Error('Stock update failed');
      alert(`Stock for ${productId} updated successfully!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStock((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  const store = data?.store;
  const inventory = data?.inventory || [];
  const orders = data?.orders || [];

  return (
    <div className="p-6 sm:p-10 space-y-8">
      
      {/* Store Header & Open/Closed Toggle */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Store className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {store?.name || 'Assigned Store'}
              </h1>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                store?.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {store?.isOpen ? 'Accepting Orders' : 'Temporarily Closed'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {store?.address} • Phone: {store?.phone}
            </p>
          </div>
        </div>

        {/* Toggle Store Availability */}
        <button
          onClick={handleToggleStoreOpen}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs self-start sm:self-center ${
            store?.isOpen
              ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{store?.isOpen ? 'Pause Orders (Close Store)' : 'Open Store Now'}</span>
        </button>
      </div>

      {/* Assigned Store Orders Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            <span>Store Orders ({orders.length})</span>
          </h2>
          <button
            onClick={fetchStoreData}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No active orders for this store currently.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Customer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-3 font-mono font-bold text-slate-900">{ord.id}</td>
                    <td className="py-3 font-black text-slate-900">₹{Number(ord.total_amount || ord.totalAmount).toFixed(0)}</td>
                    <td className="py-3 uppercase text-[10px] text-slate-500">{ord.payment_method || ord.paymentMethod}</td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/orders/${ord.id}`}
                        target="_blank"
                        className="text-amber-600 font-bold hover:underline"
                      >
                        View Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Store Inventory & Stock Adjustments */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600" />
          <span>Product Inventory &amp; Stock Levels</span>
        </h2>
        <p className="text-xs text-slate-500">
          Adjust store stock quantities. Changes reflect instantly to customer carts across Virajpete.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Unit</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock Units</th>
                <th className="pb-3 text-right">Save Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <td className="py-3 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3 text-slate-500">{item.unit}</td>
                  <td className="py-3 font-black text-slate-900">₹{item.price}</td>
                  <td className="py-3">
                    <input
                      type="number"
                      min={0}
                      value={stockInputs[item.id] ?? item.stock}
                      onChange={(e) =>
                        setStockInputs({ ...stockInputs, [item.id]: parseInt(e.target.value, 10) })
                      }
                      className="w-20 px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 focus:border-amber-500 outline-hidden"
                    />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleSaveStock(item.id)}
                      disabled={updatingStock[item.id]}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                    >
                      {updatingStock[item.id] ? 'Saving...' : 'Update'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

