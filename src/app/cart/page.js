'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Store,
  FileText,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { calculateDistanceKm, VIRAJPET_CENTER_COORDS } from '../../lib/geo';
import { formatWhatsAppOrderMessage, getWhatsAppUrl, DISPLAY_WHATSAPP_NUMBER } from '../../lib/whatsapp';

export default function CartPage() {
  const { 
    cartItems, 
    store, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    itemCount, 
    subtotal,
    appliedCoupon,
    setAppliedCoupon
  } = useCart();
  const { currentLocation, setIsLocationModalOpen } = useLocation();
  const { user } = useAuth();

  // Delivery & Contact State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(
    currentLocation?.phone || (user?.phone ? user.phone.replace('+91 ', '') : '')
  );
  const [house, setHouse] = useState(currentLocation?.house || '');
  const [street, setStreet] = useState(currentLocation?.street || '');
  const [landmark, setLandmark] = useState(currentLocation?.landmark || '');
  const [notes, setNotes] = useState('');
  const [rxAcknowledged, setRxAcknowledged] = useState(false);

  // Validation & UI State
  const [validationError, setValidationError] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [serverPricing, setServerPricing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Completed WhatsApp Order State
  const [submittedOrder, setSubmittedOrder] = useState(null);

  // Sync address with location context
  useEffect(() => {
    if (currentLocation) {
      if (!house && currentLocation.house) setHouse(currentLocation.house);
      if (!street && currentLocation.street) setStreet(currentLocation.street);
      if (!landmark && currentLocation.landmark) setLandmark(currentLocation.landmark);
      if (!customerPhone && currentLocation.phone) setCustomerPhone(currentLocation.phone);
    }
  }, [currentLocation]);

  // Sync with auth user
  useEffect(() => {
    if (user) {
      if (!customerName && user.name) setCustomerName(user.name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone.replace('+91 ', ''));
    }
  }, [user]);

  // Serviceability check
  const lat = currentLocation?.lat || VIRAJPET_CENTER_COORDS.lat;
  const lng = currentLocation?.lng || VIRAJPET_CENTER_COORDS.lng;
  const distanceKm = calculateDistanceKm(
    VIRAJPET_CENTER_COORDS.lat,
    VIRAJPET_CENTER_COORDS.lng,
    lat,
    lng
  );
  const isServiceable = distanceKm <= 5.0;

  // Server pricing validation
  useEffect(() => {
    if (cartItems.length === 0) {
      setServerPricing(null);
      return;
    }

    fetch('/api/cart/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems.map((i) => ({ id: i.id, quantity: i.quantity })),
        couponCode: appliedCoupon ? appliedCoupon.code : null,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setServerPricing(data.pricing);
        } else {
          setCouponError(data.error);
        }
      })
      .catch((err) => console.warn('Cart server validation err:', err));
  }, [cartItems, appliedCoupon]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid promo code');
      }

      setAppliedCoupon({
        code: data.coupon.code,
        discountAmount: data.discountAmount,
      });
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const hasPrescriptionItems = cartItems.some((i) => i.isPrescriptionRequired);

  // Pricing calculations
  const deliveryFee = serverPricing ? serverPricing.deliveryFee : subtotal >= 499 ? 0 : 35;
  const taxAmount = serverPricing ? serverPricing.taxAmount : Number((subtotal * 0.05).toFixed(2));
  const discount = serverPricing ? serverPricing.discountAmount : appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = serverPricing ? serverPricing.totalAmount : Math.max(0, subtotal + deliveryFee + taxAmount - discount);

  // Handle WhatsApp Order Trigger
  const handleOrderByWhatsApp = async () => {
    setValidationError('');

    if (!customerName.trim()) {
      setValidationError('Please enter your full name for the delivery.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit WhatsApp / phone number.');
      return;
    }

    if (!house.trim()) {
      setValidationError('Please specify your House / Flat / Building name or number.');
      return;
    }

    if (!street.trim()) {
      setValidationError('Please specify your Street or Road name in Virajpete.');
      return;
    }

    if (!isServiceable) {
      setValidationError(`Selected address (${distanceKm} km away) is outside the 5 km Virajpete delivery boundary.`);
      return;
    }

    if (hasPrescriptionItems && !rxAcknowledged) {
      setValidationError('Please check the box to confirm you possess a valid prescription for Schedule H medicines.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Generate unique Order ID
      const orderRef = `BG-WA-${Date.now().toString().slice(-6)}`;

      const deliveryAddress = {
        house: house.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        area: currentLocation.area || 'Virajpete Town',
        contactName: customerName.trim(),
        contactPhone: cleanPhone,
        lat,
        lng,
      };

      // 2. Record order on server for Admin & Store Manager tracking
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems.map((i) => ({ id: i.id, quantity: i.quantity })),
            deliveryAddress,
            paymentMethod: 'whatsapp',
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            deliveryInstructions: notes,
            idempotencyKey: crypto.randomUUID(),
          }),
        });
      } catch (e) {
        // Fallback gracefully
        console.warn('Server order logging fallback:', e);
      }

      // 3. Format complete WhatsApp message
      const message = formatWhatsAppOrderMessage({
        orderId: orderRef,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        address: deliveryAddress,
        items: cartItems,
        storeName: store?.name || 'BeeGo Virajpete Store',
        subtotal,
        deliveryFee,
        tax: taxAmount,
        discount,
        couponCode: appliedCoupon?.code,
        total,
        notes,
      });

      // 4. Construct WhatsApp URL
      const whatsappUrl = getWhatsAppUrl(message);

      // Save submitted order state before clearing
      setSubmittedOrder({
        orderId: orderRef,
        whatsappUrl,
        items: [...cartItems],
        total,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        address: deliveryAddress,
      });

      // Open WhatsApp in new tab
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }

      // Clear the cart
      clearCart();
    } catch (err) {
      setValidationError(err.message || 'Error preparing WhatsApp order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was just submitted, show WhatsApp confirmation screen
  if (submittedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center space-y-6 animate-in fade-in">
        <div className="w-20 h-20 bg-emerald-100 border-2 border-emerald-300 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Initiated via WhatsApp
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#380611] tracking-tight">
            Order Sent to BeeGo Virajpete!
          </h1>
          <p className="text-xs text-[#7E6569] max-w-md mx-auto">
            Order ID: <strong className="font-mono text-[#380611] font-bold">{submittedOrder.orderId}</strong>
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[#F0E6D6] shadow-xs text-left space-y-4 max-w-md mx-auto text-xs text-[#2C0C12]">
          <div className="flex justify-between pb-3 border-b border-[#F0E6D6]">
            <span className="text-[#7E6569]">Customer</span>
            <strong className="text-[#380611]">{submittedOrder.customerName} ({submittedOrder.customerPhone})</strong>
          </div>
          <div className="flex justify-between pb-3 border-b border-[#F0E6D6]">
            <span className="text-[#7E6569]">Delivery Address</span>
            <span className="font-medium text-[#380611] text-right max-w-[200px] truncate">
              {submittedOrder.address.house}, {submittedOrder.address.street}
            </span>
          </div>
          <div className="flex justify-between pb-3 border-b border-[#F0E6D6]">
            <span className="text-[#7E6569]">Total Items</span>
            <strong className="text-[#380611]">{submittedOrder.items.length} items</strong>
          </div>
          <div className="flex justify-between pt-1 text-sm font-black text-[#380611]">
            <span>Total Payable on Delivery</span>
            <span className="text-emerald-700 text-base">₹{Number(submittedOrder.total).toFixed(0)}</span>
          </div>
        </div>

        <div className="space-y-3 max-w-md mx-auto">
          <a
            href={submittedOrder.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
            </svg>
            <span>Re-open WhatsApp Chat</span>
          </a>

          <Link
            href="/"
            className="block w-full py-3 bg-[#FAF5EC] hover:bg-[#F0E6D6] text-[#58111E] font-bold text-xs rounded-xl transition-colors border border-[#F0E6D6]"
          >
            Order More from Virajpete Stores
          </Link>
        </div>

        <p className="text-[11px] text-[#7E6569]">
          Our Virajpete delivery hub will confirm your delivery time and rider details on WhatsApp.
        </p>
      </div>
    );
  }

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-[#FAF5EC] border border-[#F0E6D6] text-[#58111E] flex items-center justify-center mx-auto">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#380611] tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-xs text-[#7E6569] max-w-sm mx-auto">
            Select items from local Virajpete stores, groceries, or restaurants, and order directly on WhatsApp.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-md shadow-[#58111E]/20 transition-all hover:scale-[1.02]"
        >
          <span>Explore Virajpete Stores</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#380611] tracking-tight">
            Delivery Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-[#7E6569] mt-0.5">
            Order by WhatsApp from <strong className="text-[#380611]">{store?.name || 'Local Merchant'}</strong>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs text-[#7E6569] hover:text-rose-600 font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items & Delivery Details Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Store Pill */}
          <div className="p-4 bg-white rounded-2xl border border-[#F0E6D6] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center font-bold">
                <Store className="w-5 h-5 text-[#58111E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#380611]">{store?.name}</h3>
                <p className="text-[11px] text-[#7E6569]">Virajpete hyperlocal fulfillment</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              Active Store
            </span>
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-3xl border border-[#F0E6D6] shadow-xs divide-y divide-[#F0E6D6] overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-[#FAF5EC] overflow-hidden shrink-0 border border-[#F0E6D6]">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#380611] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#7E6569] font-mono">
                      ₹{item.price} • {item.unit || '1 unit'}
                    </p>
                    {item.isPrescriptionRequired && (
                      <span className="inline-block mt-0.5 text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">
                        Rx Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Stepper & Price */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center bg-[#FAF5EC] rounded-xl p-1 border border-[#F0E6D6]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white text-[#380611] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#380611]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white text-[#380611] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-16 text-right">
                    <span className="text-xs sm:text-sm font-black text-[#380611]">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#7E6569] hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Delivery & Contact Details Form */}
          <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4 text-[#58111E]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#380611]">Delivery &amp; Contact Details</h2>
                  <p className="text-[11px] text-[#7E6569]">Sent directly to WhatsApp for order delivery</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="text-xs font-bold text-[#58111E] hover:underline"
              >
                Change Map Pin
              </button>
            </div>

            {/* Serviceability banner */}
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              isServiceable ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2">
                {isServiceable ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>
                  {isServiceable
                    ? `Within Virajpete 5 km delivery boundary (${distanceKm} km from clock tower)`
                    : `Outside delivery boundary (${distanceKm} km from clock tower. Max 5 km).`}
                </span>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Bopanna"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-2.5 pl-8 rounded-xl border border-[#F0E6D6] focus:border-[#58111E] outline-hidden"
                  />
                  <User className="w-3.5 h-3.5 text-[#7E6569] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                  WhatsApp / Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit WhatsApp number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs p-2.5 pl-8 rounded-xl border border-[#F0E6D6] focus:border-[#58111E] outline-hidden font-mono"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#7E6569] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                  House / Flat / Building *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No. 12, Coffee View Estate"
                  value={house}
                  onChange={(e) => setHouse(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F0E6D6] focus:border-[#58111E] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                  Street / Area in Virajpete *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Clock Tower Road, Telugubedha"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F0E6D6] focus:border-[#58111E] outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near St. Anne's Church or Government Hospital"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F0E6D6] focus:border-[#58111E] outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-[#380611] uppercase tracking-wider mb-1">
                  Delivery Notes / Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before reaching, ring doorbell, leave at gate"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#F0E6D6] focus:border-[#58111E] outline-hidden"
                />
              </div>
            </div>

            {/* Schedule H acknowledgement if applicable */}
            {hasPrescriptionItems && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>Prescription Medicine Compliance (Schedule H)</span>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rxAcknowledged}
                    onChange={(e) => setRxAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="text-[11px] leading-relaxed">
                    I confirm that I have a valid doctor’s prescription and will show it upon delivery in Virajpete.
                  </span>
                </label>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Bill Summary & WhatsApp Order Action */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Promo Code Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#F0E6D6] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#380611] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#58111E]" />
              <span>Apply Promo Code</span>
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <p className="text-[11px] text-emerald-800">
                      Saving ₹{discount.toFixed(0)} on this order
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. BEEGO50"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 text-xs uppercase font-mono px-3 py-2.5 rounded-xl border border-[#F0E6D6] focus:border-[#58111E] outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl transition-colors disabled:opacity-40"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{couponError}</span>
                  </p>
                )}
                <div className="text-[10px] text-[#7E6569]">
                  Try promo: <strong className="text-[#58111E]">BEEGO50</strong> (₹50 off &gt; ₹199) or <strong className="text-[#58111E]">FREESHIP</strong>
                </div>
              </form>
            )}
          </div>

          {/* Bill Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#380611]">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs text-[#2C0C12]">
              <div className="flex items-center justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#380611]">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>Delivery Fee</span>
                  {subtotal >= 499 && (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      Free delivery applied
                    </span>
                  )}
                </div>
                <span className="font-semibold text-[#380611]">
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    `₹${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Estimated Taxes (GST 5%)</span>
                <span className="font-semibold text-[#380611]">₹{taxAmount.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#F0E6D6] flex items-baseline justify-between text-base font-black text-[#380611]">
                <span>To Pay on Delivery</span>
                <span className="text-xl">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* ORDER BY WHATSAPP BUTTON (ONLY METHOD) */}
            <button
              onClick={handleOrderByWhatsApp}
              disabled={isSubmitting || !isServiceable}
              className="w-full py-4 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col items-center justify-center gap-1 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
                </svg>
                <span>{isSubmitting ? 'Preparing WhatsApp Order...' : `Order via WhatsApp • ₹${total.toFixed(0)}`}</span>
              </div>
              <span className="text-[10px] font-normal text-emerald-100">
                Direct WhatsApp confirmation with Virajpete desk
              </span>
            </button>

            <div className="pt-2 text-[10px] text-center text-[#7E6569] space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash / UPI on Delivery in Virajpete</span>
              </p>
              <p>Helpline: {DISPLAY_WHATSAPP_NUMBER}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
