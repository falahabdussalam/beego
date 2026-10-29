'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Users, 
  AlertTriangle, 
  Store, 
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOverview = () => {
    setLoading(true);
    fetch('/api/admin/overview')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load admin overview or unauthorized');
        return res.json();
      })
      .then((resData) => {
        setData(resData);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    activeCustomersCount: 0,
    lowStockCount: 0,
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time operations, dispatch metrics &amp; inventory for Virajpete Hub
          </p>
        </div>
        <button
          onClick={fetchOverview}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}. Please ensure you are signed in with the Admin role (admin@beegodelivery.in).</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{metrics.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            Active settled &amp; COD orders in Virajpete
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {metrics.totalOrders}
          </div>
          <p className="text-[11px] text-slate-500">
            Completed: <strong className="text-emerald-600">{metrics.completedOrders}</strong> • Pending: <strong className="text-amber-600">{metrics.pendingOrders}</strong>
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value (AOV)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{metrics.averageOrderValue.toFixed(0)}
          </div>
          <p className="text-[11px] text-slate-500">
            Across restaurant, grocery &amp; dairy carts
          </p>
        </div>

        {/* Low Stock Warnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Stock Warnings</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {metrics.lowStockCount}
          </div>
          <p className="text-[11px] text-rose-600 font-semibold">
            Products with ≤ 5 units left in store
          </p>
        </div>

      </div>

      {/* Two Column Grid: Recent Orders & Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Orders in Virajpete
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data?.recentOrders?.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No orders placed yet. Customer orders placed via WhatsApp will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Store</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data?.recentOrders?.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-900">
                        {ord.id}
                      </td>
                      <td className="py-3 text-slate-600">
                        {ord.store_id || ord.storeId}
                      </td>
                      <td className="py-3 font-bold text-slate-900">
                        ₹{Number(ord.total_amount || ord.totalAmount).toFixed(0)}
                      </td>
                      <td className="py-3 uppercase text-[10px] text-slate-500 font-semibold">
                        {ord.payment_method || ord.paymentMethod}
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/orders/${ord.id}`}
                          className="text-amber-600 hover:text-amber-700 font-bold text-[11px]"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Low Stock Alerts</span>
            </h2>
            <Link href="/admin/products" className="text-xs font-bold text-amber-600">
              Inventory →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {data?.lowStockProducts?.map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between">
                <div className="truncate max-w-[180px]">
                  <p className="font-bold text-slate-900 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.storeName || p.storeId}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-700">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

