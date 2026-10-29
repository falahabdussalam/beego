'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Trash2, 
  Search, 
  Package, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Tag, 
  Store, 
  Layers, 
  Eye,
  RefreshCw,
  X
} from 'lucide-react';
import { INITIAL_STORES } from '../../../server/data/stores';
import { CATEGORIES_DATA } from '../../../server/data/categories';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    unit: '1 unit',
    stock: 25,
    storeId: INITIAL_STORES[0]?.id || 'store_coorg_heritage',
    categoryId: CATEGORIES_DATA[0]?.id || 'food-dining',
    isPrescriptionRequired: false,
    description: '',
    image: '',
    tags: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    const selectedStore = INITIAL_STORES.find((s) => s.id === form.storeId);
    const selectedCat = CATEGORIES_DATA.find((c) => c.id === form.categoryId);

    const priceNum = parseFloat(form.price) || 0;
    const origPriceNum = form.originalPrice ? parseFloat(form.originalPrice) : priceNum;
    const discountPercent = origPriceNum > priceNum 
      ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) 
      : 0;

    const payload = {
      name: form.name.trim(),
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent,
      unit: form.unit.trim() || '1 unit',
      stock: parseInt(form.stock, 10) || 0,
      storeId: form.storeId,
      storeName: selectedStore?.name || 'Local Store',
      categoryId: form.categoryId,
      categoryName: selectedCat?.name || 'General',
      isPrescriptionRequired: form.isPrescriptionRequired,
      description: form.description.trim(),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save product');
      }

      const data = await res.json();
      setProducts([data.product, ...products]);
      setShowAddModal(false);
      setStatusMessage({ 
        type: 'success', 
        text: `"${data.product.name}" added successfully and is now LIVE on customer site!` 
      });

      // Reset form
      setForm({
        name: '',
        price: '',
        originalPrice: '',
        unit: '1 unit',
        stock: 25,
        storeId: INITIAL_STORES[0]?.id || 'store_coorg_heritage',
        categoryId: CATEGORIES_DATA[0]?.id || 'food-dining',
        isPrescriptionRequired: false,
        description: '',
        image: '',
        tags: '',
      });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the customer site?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setStatusMessage({ type: 'success', text: `"${name}" removed from customer catalog.` });
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#380611] tracking-tight">
              Products &amp; Inventory Management
            </h1>
            <span className="bg-[#FAF5EC] border border-[#F0E6D6] text-[#58111E] text-xs font-black px-2.5 py-0.5 rounded-full">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs text-[#7E6569] mt-1">
            Items added here will immediately appear on the BeeGo customer website in Virajpet
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl border border-[#F0E6D6] bg-white text-[#58111E] hover:bg-[#FAF5EC] transition-colors"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage.text && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button 
            onClick={() => setStatusMessage({ type: '', text: '' })} 
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F0E6D6] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products by name, store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-4 py-2.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] outline-hidden text-[#380611] placeholder:text-[#7E6569]"
          />
          <Search className="w-3.5 h-3.5 text-[#7E6569] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <label className="text-[11px] font-bold text-[#7E6569] whitespace-nowrap">Filter Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs p-2 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] text-[#380611] font-medium outline-hidden"
          >
            <option value="all">All Categories ({products.length})</option>
            {CATEGORIES_DATA.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#F0E6D6] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-[#7E6569] space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#58111E] mx-auto" />
            <p>Loading catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF5EC] border border-[#F0E6D6] text-[#58111E] flex items-center justify-center mx-auto">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#380611]">
              {products.length === 0 ? 'No Products Added Yet' : 'No Matching Products Found'}
            </h3>
            <p className="text-xs text-[#7E6569] max-w-sm mx-auto">
              {products.length === 0 
                ? 'Your customer site currently has zero demo items. Click "Add New Product" to list genuine products from Virajpet stores.'
                : 'Try clearing your search query or selecting a different category filter.'}
            </p>
            {products.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-md transition-all mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Product</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0E6D6] text-[#7E6569] uppercase font-bold text-[10px]">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Store</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock Units</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6D6]/60">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF5EC]/40 transition-colors">
                    <td className="py-3.5 font-bold text-[#380611]">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80'}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#F0E6D6] shrink-0 bg-[#FAF5EC]"
                        />
                        <div>
                          <span className="block text-xs font-bold text-[#380611]">{p.name}</span>
                          <span className="text-[10px] text-[#7E6569] font-normal">{p.unit}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-[#58111E] font-medium">{p.storeName}</td>
                    <td className="py-3.5 text-[#7E6569]">{p.categoryName}</td>
                    <td className="py-3.5 font-black text-[#380611]">
                      <div className="flex items-center gap-1.5">
                        <span>₹{Number(p.price).toFixed(0)}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-[#7E6569] line-through font-normal">
                            ₹{Number(p.originalPrice).toFixed(0)}
                          </span>
                        )}
                        {p.discountPercent > 0 && (
                          <span className="text-[9px] font-bold bg-[#58111E] text-white px-1.5 py-0.2 rounded">
                            {p.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 font-bold">
                      <span className={p.stock <= 5 ? 'text-rose-600' : 'text-[#380611]'}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {p.isPrescriptionRequired ? (
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
                          Schedule H (Rx)
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Live Product
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-[#58111E] hover:bg-[#FAF5EC] transition-colors"
                          title="View on Customer Site"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#FDFBF7] rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-[#F0E6D6] max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#F0E6D6] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#380611]">Add New Product to Catalog</h2>
                <p className="text-[11px] text-[#7E6569]">This item will appear instantly on the Virajpet customer website</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F0E6D6] text-[#7E6569] hover:text-[#380611] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Coorg Green Cardamom (100g) or Pandi Curry"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 150"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="e.g. 180"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Unit / Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="e.g. 1 kg, 500ml, 1 box"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Merchant Store *
                  </label>
                  <select
                    value={form.storeId}
                    onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] text-[#380611] outline-hidden"
                  >
                    {INITIAL_STORES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] text-[#380611] outline-hidden"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                  Product Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Fresh details, sourcing information, estate location..."
                  className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#380611] uppercase mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="e.g. Bestseller, Fresh, Hot"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPrescriptionRequired}
                  onChange={(e) => setForm({ ...form, isPrescriptionRequired: e.target.checked })}
                  className="rounded text-[#58111E] focus:ring-[#58111E] w-4 h-4"
                />
                <span className="font-semibold text-[#380611]">
                  Schedule H Prescription Required (Pharmacy compliance check)
                </span>
              </label>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#F0E6D6]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-[#7E6569] hover:bg-[#F0E6D6] rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

