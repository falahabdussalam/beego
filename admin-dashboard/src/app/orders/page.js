'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  Eye, 
  X, 
  MessageSquare 
} from 'lucide-react';
import { API_BASE } from '../../lib/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        setStatusMessage({
          type: 'success',
          text: `Order #${orderId} marked as "${newStatus.replace('_', ' ').toUpperCase()}".`,
        });
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const statusTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'placed', label: 'Placed' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone?.includes(searchQuery) ||
      o.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#380611] tracking-tight">
              Orders &amp; Dispatch Console
            </h1>
            <span className="bg-[#FAF5EC] border border-[#F0E6D6] text-[#58111E] text-xs font-black px-2.5 py-0.5 rounded-full">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>
          <p className="text-xs text-[#7E6569] mt-1">
            Real-time fulfillment and status tracker for WhatsApp orders and web checkouts in Virajpete
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#F0E6D6] bg-white text-[#58111E] hover:bg-[#FAF5EC] font-bold text-xs transition-colors shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Status Message */}
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
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#F0E6D6] shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {statusTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedStatus(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedStatus === t.id
                  ? 'bg-[#58111E] text-white shadow-xs'
                  : 'bg-[#FAF5EC] text-[#7E6569] hover:text-[#380611] hover:bg-[#F0E6D6]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by customer name, phone number, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-4 py-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] outline-hidden text-[#380611] placeholder:text-[#7E6569]"
          />
          <Search className="w-3.5 h-3.5 text-[#7E6569] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-[#7E6569] space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#58111E] mx-auto" />
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center space-y-2 text-[#7E6569] text-xs">
            <ShoppingBag className="w-8 h-8 text-[#58111E] mx-auto mb-2 opacity-60" />
            <p className="font-bold text-[#380611]">No matching orders found.</p>
            <p>Orders submitted by customers on the site or via WhatsApp show up here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0E6D6] text-[#7E6569] uppercase font-bold text-[10px]">
                  <th className="pb-3">Order Ref</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Store</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6D6]/60">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF5EC]/40 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#58111E]">{o.id}</td>
                    <td className="py-3.5">
                      <span className="block font-bold text-[#380611]">{o.customerName}</span>
                      <span className="text-[10px] text-[#7E6569]">{o.customerPhone}</span>
                    </td>
                    <td className="py-3.5 text-[#58111E] font-medium">{o.storeName}</td>
                    <td className="py-3.5 text-[#7E6569]">
                      {o.items?.length || 0} {(o.items?.length === 1 ? 'item' : 'items')}
                    </td>
                    <td className="py-3.5 font-black text-[#380611]">₹{o.totalAmount}</td>
                    <td className="py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(o.status)}`}>
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={o.status}
                          disabled={updatingId === o.id}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                          className="text-xs p-1.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] text-[#380611] font-medium outline-hidden disabled:opacity-50"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 rounded-xl bg-white border border-[#F0E6D6] text-[#58111E] hover:bg-[#FAF5EC] transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-[#F0E6D6] max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#F0E6D6] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#58111E]">{selectedOrder.id}</span>
                <h2 className="text-base font-bold text-[#380611]">Order Fulfillment Summary</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full hover:bg-[#F0E6D6] text-[#7E6569] hover:text-[#380611] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-white rounded-2xl p-4 border border-[#F0E6D6] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#58111E]" />
                    <span className="font-bold text-[#380611]">{selectedOrder.customerName}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <a
                      href={`https://wa.me/91${selectedOrder.customerPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 hover:bg-emerald-100"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp Customer</span>
                    </a>
                  )}
                </div>

                <div className="text-[#7E6569] space-y-1 pt-1 border-t border-[#F0E6D6]/60">
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#58111E] shrink-0 mt-0.5" />
                    <span>
                      {selectedOrder.deliveryAddress?.house}, {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.area}
                      {selectedOrder.deliveryAddress?.landmark ? ` (Near ${selectedOrder.deliveryAddress.landmark})` : ''}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#58111E] shrink-0" />
                    <span>{selectedOrder.customerPhone}</span>
                  </p>
                </div>

                {selectedOrder.deliveryInstructions && (
                  <p className="p-2 rounded-xl bg-[#FAF5EC] text-[11px] text-[#7E6569] border border-[#F0E6D6]">
                    <strong>Note:</strong> {selectedOrder.deliveryInstructions}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#F0E6D6] space-y-2.5">
                <span className="text-[11px] font-bold text-[#7E6569] uppercase tracking-wider block">
                  Items Ordered ({selectedOrder.storeName})
                </span>
                <div className="divide-y divide-[#F0E6D6]/60">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#380611]">{item.name}</span>
                        <span className="text-[11px] text-[#7E6569] block">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-[#380611]">₹{Number(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#F0E6D6] space-y-1 text-right">
                  <div className="flex justify-between text-[#7E6569]">
                    <span>Item Subtotal:</span>
                    <span>₹{selectedOrder.itemSubtotal || selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-[#7E6569]">
                    <span>Delivery Fee:</span>
                    <span>{selectedOrder.deliveryFee ? `₹${selectedOrder.deliveryFee}` : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-[#380611] pt-1 border-t border-[#F0E6D6]/60">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#F0E6D6] flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-[#7E6569]">Current Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-0.5 ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>

                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="text-xs p-2 rounded-xl bg-white border border-[#F0E6D6] text-[#380611] font-bold outline-hidden"
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#58111E] text-white rounded-xl text-xs font-bold"
              >
                Close Summary
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
