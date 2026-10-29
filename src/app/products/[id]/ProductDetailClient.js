'use client';

import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { formatSingleProductWhatsAppMessage, getWhatsAppUrl } from '../../../lib/whatsapp';

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

      {/* Direct Order on WhatsApp Button */}
      <a
        href={getWhatsAppUrl(formatSingleProductWhatsAppMessage(product, qty, 'Virajpete Town'))}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
        </svg>
        <span>Instant Order on WhatsApp</span>
      </a>

      {inCartQty > 0 && (
        <p className="text-[11px] text-slate-500 font-medium">
          Currently in your cart: <strong className="text-slate-900">{inCartQty} units</strong>
        </p>
      )}
    </div>
  );
}

