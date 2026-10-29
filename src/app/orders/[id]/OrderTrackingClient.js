'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  PackageCheck, 
  Bike, 
  Home, 
  AlertCircle, 
  XCircle,
  Phone,
  MapPin,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

const ORDER_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Received by BeeGo dispatch', icon: Clock },
  { key: 'accepted', label: 'Accepted by Store', desc: 'Merchant confirmed order', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing Items', desc: 'Packing & quality check', icon: ChefHat },
  { key: 'ready_for_pickup', label: 'Ready for Pickup', desc: 'Awaiting delivery partner', icon: PackageCheck },
  { key: 'picked_up', label: 'Order Picked Up', desc: 'Partner loaded insulated bag', icon: Bike },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'On the way to your door', icon: Bike },
  { key: 'delivered', label: 'Delivered', desc: 'Handed over at Virajpete address', icon: Home },
];

export default function OrderTrackingClient({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const fetchOrder = () => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Order not found or access unauthorized');
        return res.json();
      })
      .then((data) => {
        setOrder(data.order);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  // Poll order status every 5 seconds from server
  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', reason: cancelReason || 'Cancelled by customer' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel order');

      setCancelModalOpen(false);
      fetchOrder();
    } catch (e) {
      alert(e.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FAF5EC] rounded-3xl p-12 border border-[#F0E6D6] text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#58111E] animate-spin mx-auto" />
        <p className="text-xs text-[#7A162D]/70 font-semibold">Connecting to live tracking server...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#FAF5EC] rounded-3xl p-12 border border-[#F0E6D6] text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-[#380611]">Order Not Found</h2>
        <p className="text-xs text-[#7A162D]/70">{error || 'Could not load order details.'}</p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';
  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-6">
      
      {/* Top Status Card */}
      <div className="bg-[#FAF5EC] rounded-3xl p-6 sm:p-8 border border-[#F0E6D6] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E6D6]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-[#58111E] bg-[#FDFBF7] px-2.5 py-1 rounded-md border border-[#F0E6D6]">
                {order.id}
              </span>
              <span className="text-xs text-[#7A162D]/40">•</span>
              <span className="text-xs text-[#7A162D]/70">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#380611] tracking-tight mt-1.5">
              {isCancelled
                ? 'Order Cancelled'
                : isDelivered
                ? 'Order Delivered Successfully'
                : 'Delivery in Progress'}
            </h1>
          </div>

          {/* Cancel button if still in 'placed' status */}
          {order.status === 'placed' && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors self-start"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* Real Status Stepper Timeline */}
        {!isCancelled ? (
          <div className="py-4">
            <div className="relative">
              {/* Stepper Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {ORDER_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isPassed = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'border-[#58111E] bg-[#FDFBF7] text-[#380611] shadow-xs ring-1 ring-[#58111E]'
                          : isPassed
                          ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                          : 'border-[#F0E6D6] bg-[#FDFBF7]/50 text-[#7A162D]/40'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center mb-1.5 ${
                        isCurrent
                          ? 'bg-[#58111E] text-[#FDFBF7] font-bold'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#F0E6D6] text-[#7A162D]/60'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold block truncate">
                        {step.label}
                      </span>
                      <span className="text-[9px] text-[#7A162D]/70 line-clamp-1">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#F0E6D6] text-xs text-[#380611] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#58111E]" />
                <span>Estimated arrival: <strong>25-35 minutes</strong></span>
              </span>
              <span className="text-[11px] text-[#7A162D]/60">
                Auto-refreshing every 5s
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
            <p className="font-bold">Cancellation Confirmed</p>
            <p className="text-rose-800 text-[11px]">
              This order has been cancelled and any reserved items have been restored to store inventory.
            </p>
          </div>
        )}

      </div>

      {/* Delivery Destination & Store Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Address Card */}
        <div className="bg-[#FAF5EC] rounded-3xl p-6 border border-[#F0E6D6] shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#380611] uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#58111E]" />
            <span>Delivery Address</span>
          </div>
          <div className="text-xs text-[#380611] space-y-1 leading-relaxed">
            <p className="font-bold text-[#380611]">{order.deliveryAddress?.contactName || 'Customer'}</p>
            <p className="text-[#7A162D]/90">{order.deliveryAddress?.house}, {order.deliveryAddress?.street}</p>
            <p className="text-[#7A162D]/90">{order.deliveryAddress?.area}, Virajpete, Kodagu - 571218</p>
            <p className="text-[#7A162D]/70 pt-1">Phone: +91 {order.deliveryAddress?.contactPhone}</p>
            {order.deliveryInstructions && (
              <p className="text-[11px] text-[#58111E] bg-[#FDFBF7] border border-[#F0E6D6] p-2 rounded-lg mt-2">
                Note: {order.deliveryInstructions}
              </p>
            )}
          </div>
        </div>

        {/* Bill & Payment Card */}
        <div className="bg-[#FAF5EC] rounded-3xl p-6 border border-[#F0E6D6] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#380611] uppercase tracking-wider">
            <span>Payment Summary</span>
            <span className="bg-[#FDFBF7] border border-[#F0E6D6] px-2 py-0.5 rounded text-[10px] font-bold text-[#58111E]">
              {order.paymentMethod === 'whatsapp' ? 'WhatsApp Order' : order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Test Payment'}
            </span>
          </div>
          <div className="text-xs text-[#380611] space-y-2">
            <div className="flex justify-between text-[#7A162D]/90">
              <span>Item Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#7A162D]/90">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-[#7A162D]/90">
              <span>GST / Taxes</span>
              <span>₹{order.taxAmount.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order.couponCode})</span>
                <span>-₹{order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#F0E6D6] flex justify-between font-black text-[#380611] text-sm">
              <span>Total Payable</span>
              <span className="text-base">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Itemized Order List */}
      <div className="bg-[#FAF5EC] rounded-3xl p-6 border border-[#F0E6D6] shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-[#380611] uppercase tracking-wider flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-[#58111E]" />
          <span>Items Ordered ({order.items.length})</span>
        </h3>

        <div className="divide-y divide-[#F0E6D6] text-xs">
          {order.items.map((it, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#380611]">{it.quantity}x {it.product_name || it.name}</span>
                {it.is_prescription_required && (
                  <span className="text-[9px] font-bold text-rose-600 block">
                    * Prescription Verified
                  </span>
                )}
              </div>
              <span className="font-semibold text-[#380611]">
                ₹{Number(it.total_price || it.totalPrice).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF5EC] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#F0E6D6]">
            <h3 className="text-base font-bold text-[#380611]">
              Confirm Order Cancellation
            </h3>
            <p className="text-xs text-[#7A162D]/80">
              Are you sure you want to cancel order {order.id}? Since preparation has not started, cancellation is permitted without charges.
            </p>
            <input
              type="text"
              placeholder="Reason for cancellation (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-[#FDFBF7] border border-[#F0E6D6] text-[#380611] focus:outline-hidden"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#7A162D] hover:bg-[#FDFBF7] rounded-xl"
              >
                Keep Order
              </button>
              <button
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
