'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  ExternalLink, 
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import Logo from '../../components/ui/Logo';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C0C12] flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#380611] text-[#FDFBF7] flex flex-col shrink-0 border-r border-[#58111E]">
        
        {/* Brand */}
        <div className="p-6 border-b border-[#58111E] flex items-center justify-between">
          <Logo showTagline={false} />
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#58111E] text-[#FDFBF7] border border-[#7A162D] px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1">
          <Link
            href="/admin/products"
            className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
              pathname.startsWith('/admin')
                ? 'bg-[#58111E] text-[#FDFBF7] shadow-sm ring-1 ring-[#7A162D]'
                : 'text-[#FDFBF7]/70 hover:text-white hover:bg-[#58111E]/50'
            }`}
          >
            <Package className="w-4 h-4 shrink-0 text-[#FDFBF7]" />
            <span>Products &amp; Inventory</span>
          </Link>
        </nav>

        {/* Bottom Link to Customer Website */}
        <div className="p-4 border-t border-[#58111E] space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between p-3 rounded-xl bg-[#58111E]/60 hover:bg-[#58111E] text-[#FDFBF7] text-xs font-bold transition-colors border border-[#7A162D]"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Website</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </Link>
          <p className="text-[10px] text-[#FDFBF7]/50 text-center pt-1">
            BeeGo Delivery • Virajpet Hub
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-[#FDFBF7]">
        {children}
      </main>

    </div>
  );
}

