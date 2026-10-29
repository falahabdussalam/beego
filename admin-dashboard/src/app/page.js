'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Store, 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  Zap, 
  Sliders, 
  ChevronRight 
} from 'lucide-react';
import { API_BASE, CUSTOMER_SITE_URL } from '../lib/api';

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/stats`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Order #${orderId} marked as "${newStatus.replace('_', ' ').toUpperCase()}".`,
        });
        fetchStats();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleToggleStock = async (productId, currentStock) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleStock' }),
      });

      if (res.ok) {
        const updated = await res.json();
        setStatusMessage({
          type: 'success',
          text: `Stock for item updated to ${updated.product.stock > 0 ? 'In Stock (' + updated.product.stock + ')' : 'Out of Stock'}. Live on customer site!`,
        });
        fetchStats();
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to update stock' });
    }
  };

  const stats = data?.stats || {
    totalProducts: 0,
    inStockCount: 0,
    outOfStockCount: 0,
    lowStockCount: 0,
    totalStores: 0,
    activeStoresCount: 0,
    totalOrders: 0,
    pendingOrdersCount: 0,
    deliveredOrdersCount: 0,
    totalSalesVolume: 0,
    hubOpen: true,
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome & Live Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#380611] tracking-tight">
              BeeGo Dispatch &amp; Operations
            </h1>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Virajpet Active</span>
            </span>
          </div>
          <p className="text-xs text-[#7E6569] mt-1">
            Real-time management for Virajpete merchants, hyperlocal catalog, and customer orders
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl border border-[#F0E6D6] bg-white text-[#58111E] hover:bg-[#FAF5EC] transition-colors shadow-2xs"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/products"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <a
            href={CUSTOMER_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FAF5EC] hover:bg-white text-[#58111E] border border-[#F0E6D6] font-bold text-xs rounded-xl transition-all"
          >
            <span>Customer Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Live Sync Notice Banner */}
      <div className="bg-gradient-to-r from-[#FAF5EC] to-white rounded-2xl p-4 border border-[#F0E6D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#58111E] text-white flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#380611]">
              Instant Live Synchronization Connected
            </h4>
            <p className="text-[11px] text-[#7E6569]">
              Any changes made to products, stock, prices, stores, or delivery banner in this dashboard will automatically update on the live customer website in real time.
            </p>
          </div>
        </div>
        <a
          href={CUSTOMER_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-black text-[#58111E] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Open Customer Preview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
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
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Products */}
        <div className="bg-white rounded-3xl p-5 border border-[#F0E6D6] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7E6569] uppercase tracking-wider">Catalog Items</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center border border-[#F0E6D6]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#380611]">{stats.totalProducts}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {stats.inStockCount} in stock
            </span>
          </div>
          <div className="text-[11px] text-[#7E6569] flex items-center justify-between pt-1 border-t border-[#F0E6D6]/60">
            <span>Out of Stock:</span>
            <span className={`font-bold ${stats.outOfStockCount > 0 ? 'text-rose-600' : 'text-[#380611]'}`}>
              {stats.outOfStockCount} items
            </span>
          </div>
        </div>

        {/* Stores */}
        <div className="bg-white rounded-3xl p-5 border border-[#F0E6D6] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7E6569] uppercase tracking-wider">Merchant Stores</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center border border-[#F0E6D6]">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#380611]">{stats.totalStores}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {stats.activeStoresCount} active &amp; open
            </span>
          </div>
          <div className="text-[11px] text-[#7E6569] flex items-center justify-between pt-1 border-t border-[#F0E6D6]/60">
            <span>Coverage Radius:</span>
            <span className="font-bold text-[#380611]">5.0 km Virajpet</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-3xl p-5 border border-[#F0E6D6] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7E6569] uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center border border-[#F0E6D6]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#380611]">{stats.totalOrders}</span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {stats.pendingOrdersCount} pending
            </span>
          </div>
          <div className="text-[11px] text-[#7E6569] flex items-center justify-between pt-1 border-t border-[#F0E6D6]/60">
            <span>Completed Deliveries:</span>
            <span className="font-bold text-[#380611]">{stats.deliveredOrdersCount}</span>
          </div>
        </div>

        {/* Revenue / Sales */}
        <div className="bg-white rounded-3xl p-5 border border-[#F0E6D6] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#7E6569] uppercase tracking-wider">Gross Volume</span>
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center border border-[#F0E6D6]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#380611]">₹{stats.totalSalesVolume}</span>
            <span className="text-[10px] font-bold text-[#58111E] bg-[#FAF5EC] px-2 py-0.5 rounded-full border border-[#F0E6D6]">
              INR • Virajpet
            </span>
          </div>
          <div className="text-[11px] text-[#7E6569] flex items-center justify-between pt-1 border-t border-[#F0E6D6]/60">
            <span>Average Delivery:</span>
            <span className="font-bold text-[#380611]">25-30 Mins</span>
          </div>
        </div>

      </div>

      {/* Quick Access Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Link
          href="/products"
          className="bg-white rounded-2xl p-4 border border-[#F0E6D6] hover:border-[#58111E] transition-all flex items-center justify-between group shadow-2xs hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#58111E] text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#380611] group-hover:text-[#58111E]">
                Manage Products &amp; Prices
              </h3>
              <p className="text-[11px] text-[#7E6569]">Add, edit prices, toggle out-of-stock</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7E6569] group-hover:text-[#58111E] transition-colors" />
        </Link>

        <Link
          href="/stores"
          className="bg-white rounded-2xl p-4 border border-[#F0E6D6] hover:border-[#58111E] transition-all flex items-center justify-between group shadow-2xs hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center border border-[#F0E6D6]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#380611] group-hover:text-[#58111E]">
                Virajpete Merchant Stores
              </h3>
              <p className="text-[11px] text-[#7E6569]">Toggle Open/Closed status, edit stores</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7E6569] group-hover:text-[#58111E] transition-colors" />
        </Link>

        <Link
          href="/settings"
          className="bg-white rounded-2xl p-4 border border-[#F0E6D6] hover:border-[#58111E] transition-all flex items-center justify-between group shadow-2xs hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center border border-[#F0E6D6]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#380611] group-hover:text-[#58111E]">
                Delivery Rates &amp; Announcement
              </h3>
              <p className="text-[11px] text-[#7E6569]">Broadcast banners, set delivery fee</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7E6569] group-hover:text-[#58111E] transition-colors" />
        </Link>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#380611]">Recent Orders &amp; WhatsApp Log</h2>
            <p className="text-xs text-[#7E6569]">Orders placed by customers in Virajpete</p>
          </div>
          <Link
            href="/orders"
            className="text-xs font-bold text-[#58111E] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recentOrders?.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#7E6569] bg-[#FAF5EC] rounded-2xl border border-[#F0E6D6]">
            No orders logged yet. Orders placed by customers on the site or via WhatsApp appear here instantly.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0E6D6] text-[#7E6569] uppercase font-bold text-[10px]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Store</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Quick Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6D6]/60">
                {data?.recentOrders?.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF5EC]/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#58111E]">{o.id}</td>
                    <td className="py-3">
                      <span className="block font-bold text-[#380611]">{o.customerName}</span>
                      <span className="text-[10px] text-[#7E6569]">{o.customerPhone}</span>
                    </td>
                    <td className="py-3 text-[#7E6569]">{o.storeName}</td>
                    <td className="py-3 font-bold text-[#380611]">₹{o.totalAmount}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        o.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                        o.status === 'confirmed' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={o.status}
                        disabled={updatingOrderId === o.id}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="text-xs p-1.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] text-[#380611] font-medium outline-hidden disabled:opacity-50"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Catalog Quick Stock Overview */}
      <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#380611]">Catalog Items Live on Customer Site</h2>
            <p className="text-xs text-[#7E6569]">Click the toggle to immediately mark an item In-Stock or Out-of-Stock for customers</p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#58111E] hover:underline flex items-center gap-1"
          >
            <span>Full Catalog Manager</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data?.recentProducts?.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#7E6569] bg-[#FAF5EC] rounded-2xl border border-[#F0E6D6] space-y-2">
            <p className="font-bold text-[#380611]">No products added to catalog yet.</p>
            <p>Click "Add Product" to create your first item from Virajpet stores.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0E6D6] text-[#7E6569] uppercase font-bold text-[10px]">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Store</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock Units</th>
                  <th className="pb-3">Customer Availability</th>
                  <th className="pb-3 text-right">Quick Stock Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6D6]/60">
                {data?.recentProducts?.map((p) => {
                  const inStock = (p.stock || 0) > 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF5EC]/40 transition-colors">
                      <td className="py-3 font-bold text-[#380611]">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=80&q=80'}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover border border-[#F0E6D6] bg-[#FAF5EC]"
                          />
                          <div>
                            <span className="block">{p.name}</span>
                            <span className="text-[10px] text-[#7E6569] font-normal">{p.unit}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-[#58111E] font-medium">{p.storeName}</td>
                      <td className="py-3 font-black text-[#380611]">₹{p.price}</td>
                      <td className="py-3 font-bold">{p.stock}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inStock ? '✓ Available on Site' : '✕ Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleStock(p.id, p.stock)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors border ${
                            inStock 
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {inStock ? 'Mark Out of Stock' : 'Mark In Stock (25)'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
