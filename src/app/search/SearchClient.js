'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, X, AlertCircle } from 'lucide-react';
import ProductCard from '../../components/products/ProductCard';
import { CATEGORIES_DATA } from '../../server/data/categories';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('popular');
  const [inStockOnly, setInStockOnly] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce search query input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch products from server route handler
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set('search', debouncedQuery.trim());
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy) params.set('sort', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => {
        let items = data.products || [];
        if (inStockOnly) {
          items = items.filter((p) => (p.stock ?? 1) > 0);
        }
        setProducts(items);
      })
      .catch((err) => {
        console.error('Search fetch error:', err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, selectedCategory, sortBy, inStockOnly]);

  return (
    <div className="space-y-6">
      
      {/* Header & Search Input */}
      <div className="bg-[#FAF5EC] rounded-3xl p-6 border border-[#F0E6D6] shadow-2xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#380611] tracking-tight">
            Search Products in Virajpete
          </h1>
          <p className="text-xs text-[#7A162D]/70 mt-0.5">
            Real-time catalog search across food, groceries, pharmacy, and dairy
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Type a product name, spice, dish, or medicine..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm pl-11 pr-10 py-3.5 rounded-2xl bg-[#FDFBF7] border border-[#F0E6D6] focus:bg-white focus:border-[#58111E] focus:ring-2 focus:ring-[#58111E]/20 outline-hidden transition-all text-[#380611] placeholder:text-[#7A162D]/40"
          />
          <Search className="w-5 h-5 text-[#7A162D]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A162D]/50 hover:text-[#380611]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#58111E] text-[#FDFBF7]'
                  : 'bg-[#FDFBF7] text-[#58111E] border border-[#F0E6D6] hover:bg-[#FAF5EC]'
              }`}
            >
              All
            </button>
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#58111E] text-[#FDFBF7] font-bold'
                    : 'bg-[#FDFBF7] text-[#58111E] border border-[#F0E6D6] hover:bg-[#FAF5EC]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort & In-Stock Filter */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#380611] font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#F0E6D6] text-[#58111E] focus:ring-[#58111E] w-3.5 h-3.5"
              />
              <span>In Stock Only</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FDFBF7] border border-[#F0E6D6] rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#380611] outline-hidden"
            >
              <option value="popular">Sort: Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#7A162D]/70 px-1">
        <span>
          Showing <strong className="text-[#380611]">{products.length}</strong> results {debouncedQuery && `for "${debouncedQuery}"`}
        </span>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[#FAF5EC] rounded-2xl p-4 border border-[#F0E6D6] h-64 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#FAF5EC] rounded-3xl p-12 text-center border border-[#F0E6D6] shadow-2xs space-y-3">
          <AlertCircle className="w-8 h-8 text-[#7A162D]/40 mx-auto" />
          <h3 className="text-sm font-bold text-[#380611]">No items matched your search</h3>
          <p className="text-xs text-[#7A162D]/70 max-w-sm mx-auto">
            Try adjusting your search terms or clearing category filters to find available items in Virajpete.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
