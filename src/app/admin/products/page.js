'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_STORES } from '../../../server/data/catalog';
import { CATEGORIES_DATA } from '../../../server/data/categories';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    unit: '1 unit',
    stock: 20,
    storeId: 'store_coorg_heritage',
    categoryId: 'food-dining',
    isPrescriptionRequired: false,
    description: '',
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProd = {
      id: `prod_${Date.now()}`,
      name: form.name,
      price: parseFloat(form.price) || 0,
      originalPrice: parseFloat(form.price) || 0,
      discountPercent: 0,
      unit: form.unit,
      stock: parseInt(form.stock, 10) || 0,
      storeId: form.storeId,
      storeName: INITIAL_STORES.find((s) => s.id === form.storeId)?.name || 'Local Store',
      categoryId: form.categoryId,
      categoryName: CATEGORIES_DATA.find((c) => c.id === form.categoryId)?.name || 'General',
      isPrescriptionRequired: form.isPrescriptionRequired,
      description: form.description,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    };

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    setForm({
      name: '',
      price: '',
      unit: '1 unit',
      stock: 20,
      storeId: 'store_coorg_heritage',
      categoryId: 'food-dining',
      isPrescriptionRequired: false,
      description: '',
    });
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Products &amp; Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage catalog items, pricing, SKU units, and prescription classifications in Virajpete
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Store</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock Units</th>
                <th className="pb-3">Compliance</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3 font-bold text-slate-900">
                    <div>
                      <span>{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal block">{p.unit}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600">{p.storeName}</td>
                  <td className="py-3 text-slate-600">{p.categoryName}</td>
                  <td className="py-3 font-black text-slate-900">₹{p.price}</td>
                  <td className="py-3 font-bold">
                    <span className={p.stock <= 5 ? 'text-rose-600' : 'text-slate-900'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3">
                    {p.isPrescriptionRequired ? (
                      <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                        Schedule H (Rx)
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Archive Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Add New Product to Catalog</h2>
            
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Coorg Green Cardamom (100g)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="150"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Merchant Store *</label>
                  <select
                    value={form.storeId}
                    onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {INITIAL_STORES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPrescriptionRequired}
                  onChange={(e) => setForm({ ...form, isPrescriptionRequired: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Schedule H Prescription Required (Pharmacy compliance check)</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

