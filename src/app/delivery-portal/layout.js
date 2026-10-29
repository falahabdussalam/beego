'use client';

import React from 'react';
import Link from 'next/link';
import { Bike, CheckCircle, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/ui/Logo';

export default function DeliveryPortalLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Logo showTagline={false} />
          <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
            Rider
          </span>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          <Link
            href="/delivery-portal"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-xs"
          >
            <Bike className="w-4 h-4 shrink-0" />
            <span>Active Deliveries</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center justify-between p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
          >
            <span>Customer Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 text-[11px] font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}

