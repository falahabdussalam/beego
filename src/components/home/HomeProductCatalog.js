'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Search, Plus, Sparkles, RefreshCw, Zap } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import CategoryGrid from './CategoryGrid';
import { subscribeSyncEvents } from '../../lib/sync';

export default function HomeProductCatalog({ initialProducts = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveUpdated, setIsLiveUpdated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLatestProducts = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setIsLiveUpdated(true);
        setTimeout(() => setIsLiveUpdated(false), 4000);
      }
    } catch (err) {
      console.error('Failed to auto-refresh catalog:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Real-time synchronization with Admin Dashboard actions
  useEffect(() => {
    const unsubscribe = subscribeSyncEvents((event) => {
      if (event.type === 'PRODUCT_UPDATED' || event.type === 'PRODUCT_ADDED' || event.type === 'PRODUCT_DELETED') {
        fetchLatestProducts();
      }
    });

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchLatestProducts();
      }
    };

    window.addEventListener('visibilitychange', handleVisibility);

    return () => {
      unsubscribe();
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Category Filter Pills */}
      <CategoryGrid 
        activeCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      {/* Products Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#F0E6D6]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#380611] tracking-tight">
              Available Items in Virajpet
            </h2>
            <span className="bg-[#FAF5EC] border border-[#F0E6D6] text-[#58111E] text-xs font-black px-2.5 py-0.5 rounded-full">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
            </span>

            {/* Live Sync Badge */}
            {isLiveUpdated ? (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full animate-in zoom-in-75">
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                <span>Updated Live from Admin!</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-200 px-2 py-0.5 rounded-full" title="Real-time synchronized with Admin Portal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Catalog</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#7E6569] mt-0.5">
            Directly from verified local merchants in Virajpete
          </p>
        </div>

        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Filter items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-4 py-2 rounded-xl bg-white border border-[#F0E6D6] focus:border-[#58111E] outline-hidden text-[#380611] placeholder:text-[#7E6569]"
              />
              <Search className="w-3.5 h-3.5 text-[#7E6569] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          )}

          <button
            onClick={fetchLatestProducts}
            className="p-2 rounded-xl border border-[#F0E6D6] bg-white text-[#58111E] hover:bg-[#FAF5EC] transition-colors shrink-0"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Clean Products Grid or Empty State */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#F0E6D6] shadow-xs text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-[#FAF5EC] text-[#58111E] flex items-center justify-center mx-auto border border-[#F0E6D6]">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#380611]">
              Catalog Ready — No Products Added Yet
            </h3>
            <p className="text-xs text-[#7E6569] max-w-sm mx-auto leading-relaxed">
              When you add or edit products in the Admin Dashboard, they will immediately show up here for customers.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Products in Admin Dashboard</span>
            </Link>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#FAF5EC] rounded-2xl border border-[#F0E6D6] p-10 text-center text-xs text-[#7E6569] space-y-1">
          <p className="font-bold text-[#380611]">No items matching your selection.</p>
          <p>Try switching to "All Categories" or clearing the search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
