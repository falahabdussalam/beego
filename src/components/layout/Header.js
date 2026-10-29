'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Search, 
  ShoppingCart, 
  User, 
  ChevronDown, 
  ShieldAlert, 
  Store, 
  Bike, 
  LogOut,
  Layers
} from 'lucide-react';
import Logo from '../ui/Logo';
import { useLocation } from '../../context/LocationContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const router = useRouter();
  const { currentLocation, setIsLocationModalOpen } = useLocation();
  const { itemCount, subtotal } = useCart();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isPortalsOpen, setIsPortalsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Location Section */}
          <div className="flex items-center gap-6">
            <Logo />

            {/* Location Selector Pill */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200 text-left max-w-[240px]"
              title="Change Delivery Location"
            >
              <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
              <div className="truncate text-xs">
                <span className="block font-bold text-slate-900 truncate">
                  {currentLocation.area || currentLocation.name || 'Virajpete'}
                </span>
                <span className="block text-[11px] text-slate-500 truncate">
                  {currentLocation.formattedAddress || 'Virajpete, Kodagu'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search food, groceries, pharmacy, dairy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 focus:bg-white text-sm text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Quick Portals Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setIsPortalsOpen(!isPortalsOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden lg:inline">Portals</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isPortalsOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setIsPortalsOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Staff & Admin Portals
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => setIsPortalsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900"
                  >
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="font-semibold block">Admin Dashboard</span>
                      <span className="text-[10px] text-slate-500">Manage products, zones, orders</span>
                    </div>
                  </Link>
                  <Link
                    href="/store-portal"
                    onClick={() => setIsPortalsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900"
                  >
                    <Store className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-semibold block">Store Manager</span>
                      <span className="text-[10px] text-slate-500">Store stock & assigned orders</span>
                    </div>
                  </Link>
                  <Link
                    href="/delivery-portal"
                    onClick={() => setIsPortalsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900"
                  >
                    <Bike className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-semibold block">Delivery Partner</span>
                      <span className="text-[10px] text-slate-500">Active tasks & pickup updates</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Account Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[80px] truncate hidden md:inline">{user.name || 'Account'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {isAccountMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50"
                    onMouseLeave={() => setIsAccountMenuOpen(false)}
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.phone || user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {user.role}
                      </span>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      My Profile & Orders
                    </Link>
                    <button
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Sign In</span>
              </Link>
            )}

            {/* WhatsApp Quick Link */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918277000000'}?text=${encodeURIComponent('Hi BeeGo Delivery Virajpete! I would like to place an order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs transition-colors"
              title="Chat & Order on WhatsApp"
            >
              <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp Order</span>
            </a>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-slate-950" />
                {itemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-slate-950 text-amber-400 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {itemCount > 0 ? `₹${subtotal.toFixed(0)}` : 'Cart'}
              </span>
            </Link>

          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="pb-3 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search food, groceries, medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-sm text-slate-900 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>
    </header>
  );
}

