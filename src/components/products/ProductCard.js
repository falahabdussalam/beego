'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Minus, FileText, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatSingleProductWhatsAppMessage, getWhatsAppUrl } from '../../lib/whatsapp';

export default function ProductCard({ product }) {
  const { cartItems, addItem, updateQuantity } = useCart();

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = (product.stock ?? 10) <= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col justify-between hover-lift transition-all relative group">
      
      {/* Top badges: Discount & Pharmacy/Prescription Requirement */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1 items-start">
        {product.discountPercent > 0 && (
          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isPrescriptionRequired && (
          <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            Rx Required
          </span>
        )}
      </div>

      {/* Image & Product Link */}
      <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-xl bg-slate-50 relative aspect-square mb-3">
        {/* Real Product Image with fallback */}
        <img
          src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Store Name & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="truncate max-w-[120px] font-medium text-slate-500">
              {product.storeName || 'Virajpet Merchant'}
            </span>
            <span className="text-slate-400 font-mono text-[10px]">
              {product.unit || '1 unit'}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Quantity Controls */}
        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-slate-900">
                ₹{Number(product.price).toFixed(0)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{Number(product.originalPrice).toFixed(0)}
                </span>
              )}
            </div>
            {product.stock && product.stock <= 5 && !isOutOfStock && (
              <span className="text-[10px] text-amber-700 font-bold block">
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Add / Qty Control & Quick WhatsApp Order */}
          <div className="flex items-center gap-1.5">
            <a
              href={getWhatsAppUrl(formatSingleProductWhatsAppMessage(product, quantityInCart || 1, 'Virajpete Town'))}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center transition-colors shrink-0"
              title="Order this item on WhatsApp"
            >
              <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
              </svg>
            </a>

            {quantityInCart === 0 ? (
              <button
                disabled={isOutOfStock}
                onClick={() => addItem(product, 1)}
                className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 transition-all flex items-center gap-1 disabled:opacity-40 disabled:hover:bg-slate-900 disabled:hover:text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center bg-amber-500 text-slate-950 rounded-xl px-1.5 py-1 font-bold text-xs shadow-xs">
                <button
                  onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-amber-600 rounded-md transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-black">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-amber-600 rounded-md transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

