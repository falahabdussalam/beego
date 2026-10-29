import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Filter, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { CATEGORIES_DATA } from '../../../server/data/categories';
import { getProductsByCategory, getFeaturedStores } from '../../../server/data/catalog';
import ProductCard from '../../../components/products/ProductCard';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = CATEGORIES_DATA.find((c) => c.id === slug);
  if (!category) return { title: 'Category Not Found — BeeGo' };

  return {
    title: `${category.name} — BeeGo Hyperlocal Delivery Virajpete`,
    description: `Order ${category.name} online in Virajpete, Kodagu. ${category.description}. Delivered in 25-35 minutes.`,
  };
}

export default async function CategoryDetailPage({ params }) {
  const { slug } = await params;
  const category = CATEGORIES_DATA.find((c) => c.id === slug);

  if (!category) {
    notFound();
  }

  const [products, stores] = await Promise.all([
    getProductsByCategory(slug),
    getFeaturedStores(),
  ]);

  const isPharmacy = slug === 'pharmacy-medicines';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7A162D]/70">
        <Link href="/" className="hover:text-[#380611] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-[#380611] transition-colors">
          Categories
        </Link>
        <span>/</span>
        <span className="font-bold text-[#380611]">{category.name}</span>
      </div>

      {/* Category Hero Banner */}
      <div className="bg-gradient-to-r from-[#380611] via-[#58111E] to-[#7A162D] text-[#FDFBF7] rounded-3xl p-6 sm:p-10 border border-[#58111E] relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FAF5EC] text-[#58111E] text-xs font-black uppercase tracking-wider">
            {category.badge}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#FDFBF7]">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF5EC]/85 leading-relaxed">
            {category.description}. Sourced fresh from trusted Virajpete town merchants and delivered straight to your door in 25-35 minutes.
          </p>
        </div>
      </div>

      {/* Pharmacy Legal Compliance Alert (Mandatory under Indian Drug Regulations) */}
      {isPharmacy && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EC] border-2 border-[#58111E]/30 text-[#380611] space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#58111E] shrink-0" />
            <h2 className="text-sm font-bold text-[#380611]">
              Indian Pharmacy Regulatory Compliance Notice (Schedule H/H1 Drugs)
            </h2>
          </div>
          <p className="text-xs text-[#7A162D]/90 leading-relaxed">
            All medicines are dispensed exclusively by licensed registered pharmacies in Virajpete (City Care Licensed Pharmacy, Lic No: KA-KOD-2024-DRUG-0482). Regulated prescription medications marked with the <strong className="text-[#941834]">"Rx Required"</strong> tag strictly require a valid doctor’s prescription uploaded during checkout or verified upon doorstep delivery.
          </p>
        </div>
      )}

      {/* Product List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#380611]">
              Available Items ({products.length})
            </h2>
            <p className="text-xs text-[#7A162D]/70">
              Real-time store stock &amp; prices in Virajpete
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-[#FAF5EC] rounded-2xl border border-[#F0E6D6] p-12 text-center space-y-3">
            <p className="text-sm font-bold text-[#380611]">No products available currently in this category.</p>
            <p className="text-xs text-[#7A162D]/70">Please check back soon as our Virajpete merchant partners restock.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
