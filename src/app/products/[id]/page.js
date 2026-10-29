import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Store, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft 
} from 'lucide-react';
import { getProductById, getStoreById } from '../../../server/data/catalog';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: 'Product Not Found — BeeGo Delivery' };

  return {
    title: `${product.name} — BeeGo Delivery Virajpete`,
    description: `Buy ${product.name} online in Virajpete for ₹${product.price}. Sourced from ${product.storeName}. Delivered in 25-35 minutes.`,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const store = await getStoreById(product.storeId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#7E6569]">
        <Link href="/" className="hover:text-[#58111E] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/categories/${product.categoryId}`} className="hover:text-[#58111E] transition-colors">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="font-bold text-[#380611] truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Card */}
      <div className="bg-white rounded-3xl border border-[#F0E6D6] shadow-xs overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-start">
          
          {/* Left: Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF5EC] border border-[#F0E6D6]">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-[#58111E] text-[#FDFBF7] font-extrabold text-xs px-3 py-1 rounded-lg shadow-sm">
                  {product.discountPercent}% DISCOUNT
                </span>
              )}
            </div>

            {/* Virajpete Guarantee Badge */}
            <div className="p-3.5 rounded-xl bg-[#FAF5EC] border border-[#F0E6D6] text-xs text-[#380611] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#58111E] shrink-0" />
              <span>
                <strong>100% Genuine Item</strong> from licensed merchant in Virajpete, Kodagu.
              </span>
            </div>
          </div>

          {/* Right: Product Meta, Details & Client Actions */}
          <div className="space-y-6">
            
            {/* Store & Category Info */}
            <div className="flex items-center justify-between text-xs text-[#7E6569]">
              <Link
                href={`/stores/${product.storeId}`}
                className="flex items-center gap-1.5 font-bold text-[#58111E] hover:text-[#7A162D] transition-colors"
              >
                <Store className="w-4 h-4" />
                <span>{product.storeName}</span>
              </Link>
              <span className="bg-[#FAF5EC] border border-[#F0E6D6] px-2 py-0.5 rounded text-[11px] font-semibold text-[#58111E]">
                {product.unit}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-[#380611] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#380611]">
                ₹{Number(product.price).toFixed(0)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-[#7E6569] line-through">
                  ₹{Number(product.originalPrice).toFixed(0)}
                </span>
              )}
              <span className="text-xs text-[#7E6569] font-medium">
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Prescription Compliance Warning */}
            {product.isPrescriptionRequired && (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-950 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Schedule H Prescription Drug
                  </span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Under the Drugs and Cosmetics Act of India, this medication requires a valid prescription written by a registered medical practitioner. The prescription will be reviewed by the licensed pharmacist prior to packing.
                </p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-[#F0E6D6]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#7E6569]">
                Product Details
              </h2>
              <p className="text-xs sm:text-sm text-[#2C0C12] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold bg-[#FAF5EC] text-[#58111E] border border-[#F0E6D6] px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Interactive Add to Cart */}
            <ProductDetailClient product={product} />

          </div>

        </div>
      </div>

    </div>
  );
}
