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
  LogOut
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
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#F0E6D6] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Location Section */}
          <div className="flex items-center gap-6">
            <Logo />

            {/* Location Selector Pill */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#FAF5EC] hover:bg-[#F0E6D6] transition-colors border border-[#F0E6D6] text-left max-w-[240px]"
              title="Change Delivery Location"
            >
              <div className="w-7 h-7 rounded-full bg-[#58111E]/10 text-[#58111E] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#58111E]" />
              </div>
              <div className="truncate text-xs">
                <span className="block font-bold text-[#380611] truncate">
                  {currentLocation.area || currentLocation.name || 'Virajpete'}
                </span>
                <span className="block text-[11px] text-[#7E6569] truncate">
                  {currentLocation.formattedAddress || 'Virajpete, Kodagu'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#7E6569] shrink-0" />
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
                className="w-full bg-[#FAF5EC] focus:bg-white text-sm text-[#380611] pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E6D6] focus:border-[#58111E] focus:ring-2 focus:ring-[#58111E]/20 transition-all outline-hidden"
              />
              <Search className="w-4 h-4 text-[#7E6569] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Account Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#380611] bg-[#FAF5EC] hover:bg-[#F0E6D6] rounded-lg transition-colors border border-[#F0E6D6]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#58111E] text-[#FDFBF7] flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[80px] truncate hidden md:inline">{user.name || 'Account'}</span>
                  <ChevronDown className="w-3 h-3 text-[#7E6569]" />
                </button>

                {isAccountMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#F0E6D6] py-1.5 z-50"
                    onMouseLeave={() => setIsAccountMenuOpen(false)}
                  >
                    <div className="px-3 py-1.5 border-b border-[#F0E6D6]">
                      <p className="text-xs font-bold text-[#380611] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#7E6569] truncate">{user.phone || user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FAF5EC] text-[#58111E] border border-[#F0E6D6]">
                        Customer
                      </span>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-3 py-2 text-xs text-[#380611] hover:bg-[#FAF5EC] font-medium"
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
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#58111E] hover:text-[#380611] bg-[#FAF5EC] hover:bg-[#F0E6D6] rounded-lg border border-[#F0E6D6] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#58111E]" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 px-4 py-2 bg-[#58111E] hover:bg-[#7A162D] text-[#FDFBF7] rounded-xl font-bold text-xs shadow-md shadow-[#58111E]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-[#FDFBF7]" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in-50">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="block text-[10px] text-[#FAF5EC]/80 uppercase font-semibold">Cart</span>
                <span className="block text-xs font-black">₹{subtotal.toFixed(0)}</span>
              </div>
            </Link>

          </div>

        </div>
      </div>
    </header>
  );
}
