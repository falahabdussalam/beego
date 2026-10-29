'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const { setIsLocationModalOpen } = useLocation();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      // Fetch user's orders
      fetch('/api/orders')
        .then((res) => (res.ok ? res.json() : { orders: [] }))
        .then((data) => setOrders(data.orders || []))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));

      // Fetch saved addresses
      fetch('/api/addresses')
        .then((res) => (res.ok ? res.json() : { addresses: [] }))
        .then((data) => setAddresses(data.addresses || []))
        .catch(() => setAddresses([]));
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-[#7A162D]/60">
        Loading account details...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-[#FAF5EC] rounded-3xl p-6 sm:p-8 border border-[#F0E6D6] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#58111E] text-[#FDFBF7] font-black text-2xl flex items-center justify-center shadow-md">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#380611] tracking-tight">
                {user.name}
              </h1>
              <span className="bg-[#58111E]/10 text-[#58111E] border border-[#58111E]/20 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                {user.role}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#7A162D]/70 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#58111E]" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#58111E]" />
                {user.phone || 'No phone verified'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Orders History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#FAF5EC] rounded-3xl p-6 border border-[#F0E6D6] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#380611] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#58111E]" />
                <span>My Delivery Orders ({orders.length})</span>
              </h2>
            </div>

            {loadingOrders ? (
              <div className="py-8 text-center text-xs text-[#7A162D]/60">Loading order history...</div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#7A162D]/70 space-y-2">
                <p className="font-semibold text-[#380611]">No past orders found.</p>
                <p>When you place an order in Virajpete, it will appear here with live tracking.</p>
                <Link
                  href="/"
                  className="inline-block mt-2 px-4 py-2 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl"
                >
                  Start Ordering
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#F0E6D6]">
                {orders.map((o) => (
                  <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#380611]">{o.id}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          o.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-[#58111E]/10 text-[#58111E]'
                        }`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#7A162D]/80">
                        Total: <strong>₹{Number(o.total_amount || o.totalAmount).toFixed(0)}</strong> • {o.payment_method === 'whatsapp' ? 'WhatsApp Order' : o.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}
                      </p>
                      <p className="text-[11px] text-[#7A162D]/60">
                        {new Date(o.created_at || o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <Link
                      href={`/orders/${o.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl transition-colors self-start sm:self-center"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Saved Addresses */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF5EC] rounded-3xl p-6 border border-[#F0E6D6] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#380611] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#58111E]" />
                <span>Saved Addresses</span>
              </h2>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="text-xs font-bold text-[#58111E] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#F0E6D6] text-xs text-[#7A162D]/70 text-center">
                No saved addresses yet. Click "Add" or use the top location pill to set your home address.
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-3.5 rounded-2xl border border-[#F0E6D6] bg-[#FDFBF7] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#380611]">{addr.tag}</span>
                      <span className="text-[10px] text-[#7A162D]/60">Virajpete</span>
                    </div>
                    <p className="text-[#380611]">{addr.house}, {addr.street}</p>
                    <p className="text-[#7A162D]/80">{addr.area}</p>
                    <p className="text-[#7A162D]/60 text-[11px] pt-1">Phone: +91 {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Help & Support Card */}
          <div className="bg-[#380611] text-[#FDFBF7] rounded-3xl p-6 border border-[#58111E] space-y-3 text-xs">
            <h3 className="font-bold text-[#FAF5EC] uppercase tracking-wider text-[11px]">
              Virajpete Customer Care
            </h3>
            <p className="text-[#FAF5EC]/80 leading-relaxed">
              Have questions regarding an active delivery or store order? Our local Virajpete support team is available from 07:00 AM to 10:30 PM.
            </p>
            <div className="space-y-1.5 text-[#FAF5EC]/90 pt-1">
              <p>📞 Phone: <strong>+91 8274 256789</strong></p>
              <p>✉️ Email: <strong>support@beegodelivery.in</strong></p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
