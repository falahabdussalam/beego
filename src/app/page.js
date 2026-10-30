import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryShowcase from '../components/home/CategoryShowcase';
import HomeProductCatalog from '../components/home/HomeProductCatalog';
import ServiceAreaBanner from '../components/home/ServiceAreaBanner';
import { getAllProducts } from '../server/data/catalog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'BeeGo Delivery — Hyperlocal Delivery in Virajpete, Kodagu',
  description: 'Order food, groceries, fresh dairy, and essentials delivered in 25-35 minutes across Virajpete.',
};

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
      
      {/* 1. Hero Section with Interactive Animated Delivery Scene */}
      <HeroBanner />

      {/* 2. Hyperlocal Category Illustration Showcase */}
      <CategoryShowcase />

      {/* 3. Live Product Catalog */}
      <HomeProductCatalog initialProducts={products} />

      {/* 4. Service Area Information Banner */}
      <ServiceAreaBanner />

    </div>
  );
}
