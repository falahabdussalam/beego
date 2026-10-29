'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    // All orders in BeeGo are placed directly via WhatsApp from the Cart
    router.replace('/cart');
  }, [router]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-xs text-slate-500">Redirecting to Cart for WhatsApp Order...</p>
    </div>
  );
}
