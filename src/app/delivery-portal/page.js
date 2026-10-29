'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Power, 
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function DeliveryPartnerPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchTasks = () => {
    setLoading(true);
    fetch('/api/delivery-portal')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized or not a registered delivery partner');
        return res.json();
      })
      .then((resData) => {
        setData(resData);
      })
      .catch((e) => console.warn(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateDeliveryStatus = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      const res = await fetch('/api/delivery-portal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to update delivery');

      fetchTasks();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
      </div>
    );
  }

  const partner = data?.partner;
  const deliveries = data?.deliveries || [];

  return (
    <div className="p-6 sm:p-10 space-y-8">
      
      {/* Rider Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Bike className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {partner?.name || 'Delivery Partner'}
              </h1>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {isOnline ? 'Active & Ready' : 'Offline'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Vehicle: <strong>{partner?.vehicle}</strong> • Hub: Virajpete Town (5KM Zone)
            </p>
          </div>
        </div>

        {/* Online/Offline Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs self-start sm:self-center ${
            isOnline
              ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? 'Go Offline' : 'Go Online Now'}</span>
        </button>
      </div>

      {/* Assigned Deliveries List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Assigned Pickup &amp; Delivery Tasks ({deliveries.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow safe hygiene protocols and verify prescriptions when required in Virajpete
            </p>
          </div>
          <button
            onClick={fetchTasks}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {deliveries.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-700">All current orders delivered!</p>
            <p>New orders ready for pickup around Virajpete Clock Tower will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((del) => {
              const addr = typeof del.delivery_address === 'string'
                ? JSON.parse(del.delivery_address)
                : del.delivery_address || del.deliveryAddress;

              return (
                <div
                  key={del.id}
                  className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all space-y-4 bg-slate-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900">{del.id}</span>
                      <span className="bg-amber-100 text-amber-900 font-bold uppercase text-[10px] px-2 py-0.5 rounded">
                        {del.status}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">
                      Amount to Collect: ₹{Number(del.total_amount || del.totalAmount).toFixed(0)} ({del.payment_method?.toUpperCase()})
                    </span>
                  </div>

                  {/* Merchant & Customer Addresses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Merchant Pickup */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Pickup From Store
                      </span>
                      <strong className="text-slate-900 block">{del.store_name || del.store_id}</strong>
                      <p className="text-slate-500 text-[11px]">{del.store_address || 'Virajpete Market Road'}</p>
                    </div>

                    {/* Customer Dropoff */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Dropoff Address
                      </span>
                      <strong className="text-slate-900 block">{addr?.contactName || 'Customer'}</strong>
                      <p className="text-slate-500 text-[11px]">
                        {addr?.house}, {addr?.street}, {addr?.area}
                      </p>
                      <p className="text-amber-800 font-bold text-[11px] pt-0.5">
                        📞 Phone: +91 {addr?.contactPhone}
                      </p>
                    </div>
                  </div>

                  {/* Rider Status Progression Action */}
                  <div className="pt-2 flex justify-end gap-3">
                    {del.status === 'ready_for_pickup' && (
                      <button
                        disabled={actionLoading === del.id}
                        onClick={() => handleUpdateDeliveryStatus(del.id, 'picked_up')}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        {actionLoading === del.id ? 'Updating...' : 'Confirm Order Picked Up'}
                      </button>
                    )}

                    {del.status === 'picked_up' && (
                      <button
                        disabled={actionLoading === del.id}
                        onClick={() => handleUpdateDeliveryStatus(del.id, 'out_for_delivery')}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        {actionLoading === del.id ? 'Updating...' : 'Start Journey to Customer'}
                      </button>
                    )}

                    {del.status === 'out_for_delivery' && (
                      <button
                        disabled={actionLoading === del.id}
                        onClick={() => handleUpdateDeliveryStatus(del.id, 'delivered')}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        {actionLoading === del.id ? 'Updating...' : 'Confirm Delivery Completed'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

