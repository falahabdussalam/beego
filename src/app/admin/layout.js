'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Package, 
  Store,
  ShoppingBag,
  Sliders,
  ExternalLink, 
  ArrowLeft,
  Menu,
  X,
  Zap,
  ShieldCheck,
  Bell
} from 'lucide-react';
import Logo from '../../components/ui/Logo';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Products & Inventory',
      href: '/admin/products',
      icon: Package,
      active: pathname.startsWith('/admin/products'),
    },
    {
      label: 'Merchant Stores',
      href: '/admin/stores',
      icon: Store,
      active: pathname.startsWith('/admin/stores'),
    },
    {
      label: 'Orders & Deliveries',
      href: '/admin/orders',
      icon: ShoppingBag,
      active: pathname.startsWith('/admin/orders'),
    },
    {
      label: 'Platform & Settings',
      href: '/admin/settings',
      icon: Sliders,
      active: pathname.startsWith('/admin/settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C0C12] flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#380611] text-[#FDFBF7] p-4 flex items-center justify-between border-b border-[#58111E] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo showTagline={false} />
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#58111E] text-[#FDFBF7] border border-[#7A162D] px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-[#58111E] text-[#FDFBF7] hover:bg-[#7A162D] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside className={`
        ${mobileMenuOpen ? 'block' : 'hidden'} 
        md:flex w-full md:w-64 bg-[#380611] text-[#FDFBF7] flex-col shrink-0 border-r border-[#58111E]
        sticky top-0 md:h-screen z-40
      `}>
        
        {/* Brand Header */}
        <div className="p-6 border-b border-[#58111E] hidden md:flex items-center justify-between">
          <Logo showTagline={false} />
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#58111E] text-[#FDFBF7] border border-[#7A162D] px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>

        {/* Live Sync Status Pill */}
        <div className="px-5 py-3 border-b border-[#58111E]/70 bg-[#2C040C]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-emerald-300">Live Sync Active</span>
          </div>
          <p className="text-[10px] text-[#FDFBF7]/60 mt-0.5">
            Admin changes auto-update customer site
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  item.active
                    ? 'bg-[#58111E] text-[#FDFBF7] shadow-sm ring-1 ring-[#7A162D]'
                    : 'text-[#FDFBF7]/70 hover:text-white hover:bg-[#58111E]/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-[#FAF5EC]' : 'text-[#FDFBF7]/70'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Link to Customer Website */}
        <div className="p-4 border-t border-[#58111E] space-y-2.5">
          <Link
            href="/"
            className="flex items-center justify-between p-3 rounded-xl bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] text-xs font-bold transition-all border border-[#7A162D] shadow-sm hover:scale-[1.01]"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Website</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </Link>

          <div className="text-[10px] text-[#FDFBF7]/60 flex items-center justify-between px-1">
            <span>Virajpet Delivery Hub</span>
            <span className="font-mono text-[#FAF5EC]/80">v1.2</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="hidden md:flex h-16 bg-white border-b border-[#F0E6D6] px-8 items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#7E6569] uppercase tracking-wider">
              BeeGo Admin Console
            </span>
            <span className="text-[#F0E6D6]">/</span>
            <span className="text-xs font-black text-[#380611]">
              {navItems.find((i) => i.active)?.label || 'Console'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Syncing to Customer Site</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#F0E6D6] hover:border-[#58111E] bg-[#FAF5EC] hover:bg-white text-xs font-bold text-[#58111E] transition-all"
              title="Open Customer Website in New Tab"
            >
              <span>View Customer Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#FDFBF7]">
          {children}
        </main>
      </div>

    </div>
  );
}
