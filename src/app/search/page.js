import React, { Suspense } from 'react';
import SearchClient from './SearchClient';

export const metadata = {
  title: 'Search Food, Groceries & Essentials — BeeGo Delivery Virajpete',
  description: 'Search top products, local restaurants, grocery items, and medicines across Virajpete, Kodagu.',
};

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading catalog search...</div>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}

