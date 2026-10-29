'use client';

import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

export default function ProductDetailClient({ product }) {
  const { cartItems, addItem, updateQuantity } = useCart();
  const [qty, setQty] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const cartItem = cartItems.find((i) => i.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = (product.stock ?? 10) <= 0;

  const handleAddToCart = () => {
    const success = addItem(product, qty);
    if (success) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100 space-y-4">
      {/* Stock status indicator */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Stock Availability:</span>
        {isOutOfStock ? (
          <span className="text-rose-600 font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Out of Stock
          </span>
        ) : (
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            In Stock ({product.stock} available)
          </span>
        )}
      </div>

      {/* Quantity & Add Action */}
      <div className="flex items-center gap-4">
        {/* Quantity selector */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
          <button
            type="button"
            disabled={qty <= 1 || isOutOfStock}
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-slate-700 disabled:opacity-40 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center font-bold text-sm text-slate-900">
            {qty}
          </span>
          <button
            type="button"
            disabled={qty >= (product.stock ?? 99) || isOutOfStock}
            onClick={() => setQty(Math.min(product.stock ?? 99, qty + 1))}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-slate-700 disabled:opacity-40 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
            addedSuccess
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] shadow-[#58111E]/25 hover:scale-[1.01] active:scale-[0.99]'
          } disabled:opacity-40 disabled:hover:scale-100 disabled:bg-[#FAF5EC] disabled:text-[#7E6569]`}
        >
          {addedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add {qty} to Cart • ₹{(Number(product.price) * qty).toFixed(0)}</span>
            </>
          )}
        </button>
      </div>

      {inCartQty > 0 && (
        <p className="text-[11px] text-slate-500 font-medium">
          Currently in your cart: <strong className="text-slate-900">{inCartQty} units</strong>
        </p>
      )}
    </div>
  );
}

