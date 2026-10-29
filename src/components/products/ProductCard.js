'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Minus, FileText, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { cartItems, addItem, updateQuantity } = useCart();

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = (product.stock ?? 10) <= 0;

  return (
    <div className="bg-white rounded-2xl border border-[#F0E6D6] hover:border-[#58111E]/40 p-3.5 flex flex-col justify-between hover-lift transition-all relative group">
      
      {/* Top badges: Discount & Pharmacy/Prescription Requirement */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1 items-start">
        {product.discountPercent > 0 && (
          <span className="bg-[#58111E] text-[#FDFBF7] text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isPrescriptionRequired && (
          <span className="bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            Rx Required
          </span>
        )}
      </div>

      {/* Image & Product Link */}
      <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-xl bg-[#FAF5EC] relative aspect-square mb-3">
        {/* Real Product Image with fallback */}
        <img
          src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#380611]/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Store Name & Category */}
          <div className="flex items-center justify-between text-[11px] text-[#7E6569] mb-1">
            <span className="truncate max-w-[120px] font-medium text-[#7E6569]">
              {product.storeName || 'Virajpet Merchant'}
            </span>
            <span className="text-[#7E6569] font-mono text-[10px]">
              {product.unit || '1 unit'}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-bold text-[#380611] group-hover:text-[#58111E] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Quantity Controls */}
        <div className="pt-3 mt-2 border-t border-[#F0E6D6] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-[#380611]">
                ₹{Number(product.price).toFixed(0)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-[#7E6569] line-through">
                  ₹{Number(product.originalPrice).toFixed(0)}
                </span>
              )}
            </div>
            {product.stock && product.stock <= 5 && !isOutOfStock && (
              <span className="text-[10px] text-[#941834] font-bold block">
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Add / Qty Control */}
          <div>
            {quantityInCart === 0 ? (
              <button
                disabled={isOutOfStock}
                onClick={() => addItem(product, 1)}
                className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] transition-all flex items-center gap-1 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center bg-[#58111E] text-[#FDFBF7] rounded-xl px-1.5 py-1 font-bold text-xs shadow-xs">
                <button
                  onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-[#7A162D] rounded-md transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-black">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                  className="w-5 h-5 flex items-center justify-center hover:bg-[#7A162D] rounded-md transition-colors"
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

