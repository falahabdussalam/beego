'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [store, setStore] = useState(null); // active store metadata { id, name, type }
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [conflictModal, setConflictModal] = useState(null); // { newStore, pendingItem }

  useEffect(() => {
    try {
      const saved = localStorage.getItem('beego_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCartItems(parsed.items || []);
        setStore(parsed.store || null);
        setAppliedCoupon(parsed.coupon || null);
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }
  }, []);

  const saveCart = (items, currentStore, coupon) => {
    setCartItems(items);
    setStore(currentStore);
    setAppliedCoupon(coupon);
    try {
      localStorage.setItem(
        'beego_cart',
        JSON.stringify({ items, store: currentStore, coupon })
      );
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  };

  const addItem = (product, quantity = 1) => {
    // Check if adding from a different store
    if (store && store.id && product.storeId && store.id !== product.storeId && cartItems.length > 0) {
      // Prompt user to clear current cart or cancel
      setConflictModal({
        currentStoreName: store.name,
        newStoreName: product.storeName,
        pendingProduct: product,
        pendingQty: quantity,
      });
      return false;
    }

    const currentStore = store || {
      id: product.storeId,
      name: product.storeName || 'Partner Store',
    };

    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    let updated = [...cartItems];

    if (existingIndex > -1) {
      const newQty = updated[existingIndex].quantity + quantity;
      const maxStock = product.stock ?? 99;
      if (newQty > maxStock) {
        alert(`Sorry, only ${maxStock} items available in stock.`);
        return false;
      }
      updated[existingIndex].quantity = newQty;
    } else {
      updated.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        unit: product.unit,
        storeId: product.storeId,
        storeName: product.storeName,
        isPrescriptionRequired: product.isPrescriptionRequired || false,
        stock: product.stock ?? 99,
        quantity: quantity,
      });
    }

    saveCart(updated, currentStore, appliedCoupon);
    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updated = cartItems.map((item) => {
      if (item.id === productId) {
        if (newQuantity > item.stock) {
          alert(`Maximum available stock is ${item.stock}`);
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    saveCart(updated, store, appliedCoupon);
  };

  const removeItem = (productId) => {
    const updated = cartItems.filter((item) => item.id !== productId);
    const updatedStore = updated.length === 0 ? null : store;
    const updatedCoupon = updated.length === 0 ? null : appliedCoupon;
    saveCart(updated, updatedStore, updatedCoupon);
  };

  const clearCart = () => {
    saveCart([], null, null);
  };

  const resolveConflict = (replace) => {
    if (replace && conflictModal) {
      const product = conflictModal.pendingProduct;
      const newStore = {
        id: product.storeId,
        name: product.storeName || 'Partner Store',
      };
      const newItems = [
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          unit: product.unit,
          storeId: product.storeId,
          storeName: product.storeName,
          isPrescriptionRequired: product.isPrescriptionRequired || false,
          stock: product.stock ?? 99,
          quantity: conflictModal.pendingQty || 1,
        },
      ];
      saveCart(newItems, newStore, null);
    }
    setConflictModal(null);
  };

  // Calculations
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        store,
        appliedCoupon,
        setAppliedCoupon,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        conflictModal,
        resolveConflict,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}

