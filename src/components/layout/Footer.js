import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800/80 p-3 rounded-2xl inline-block border border-slate-700/50">
              <Logo showTagline={true} />
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              BeeGo is the premier hyperlocal delivery platform for Virajpete and surrounding Kodagu areas. Delivering fresh groceries, restaurant meals, medicines, daily essentials, and fresh dairy directly to your doorstep in minutes.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Genuine Products • Local Virajpete Merchants</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Daily Essentials
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/categories/food-dining" className="hover:text-amber-400 transition-colors">
                  Food & Restaurants
                </Link>
              </li>
              <li>
                <Link href="/categories/groceries" className="hover:text-amber-400 transition-colors">
                  Groceries & Staples
                </Link>
              </li>
              <li>
                <Link href="/categories/fruits-vegetables" className="hover:text-amber-400 transition-colors">
                  Fresh Fruits & Veggies
                </Link>
              </li>
              <li>
                <Link href="/categories/pharmacy-medicines" className="hover:text-amber-400 transition-colors">
                  Pharmacy & Healthcare
                </Link>
              </li>
              <li>
                <Link href="/categories/milk-dairy" className="hover:text-amber-400 transition-colors">
                  Fresh Milk & Dairy
                </Link>
              </li>
              <li>
                <Link href="/categories/beverages-snacks" className="hover:text-amber-400 transition-colors">
                  Beverages & Snacks
                </Link>
              </li>
              <li>
                <Link href="/categories/household" className="hover:text-amber-400 transition-colors">
                  Household Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Portals */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company & Portals
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/store-portal" className="hover:text-amber-400 transition-colors">
                  Store Partner Portal
                </Link>
              </li>
              <li>
                <Link href="/delivery-portal" className="hover:text-amber-400 transition-colors">
                  Delivery Partner Portal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Help & Customer Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Area & Support */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Virajpete Hub
            </h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Clock Tower Main Road, Virajpete, Kodagu, Karnataka - 571218</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Operating Hours: 07:00 AM - 10:30 PM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+91 8274 256789</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>support@beegodelivery.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Prescription Compliance Note */}
        <div className="py-6 border-b border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">
            Regulatory Disclosure & Pharmacy Compliance:
          </p>
          <p>
            BeeGo acts as a technology intermediary connecting consumers with licensed local pharmacies and stores in Virajpete, Kodagu. Regulated pharmaceutical products (Schedule H/H1) strictly require a valid registered medical practitioner prescription verified prior to dispensing in accordance with the Drugs and Cosmetics Act, 1940 and Pharmacy Practice Regulations.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} BeeGo Delivery. All rights reserved. Crafted for Virajpete, Kodagu.
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Powered by</span>
            <span className="font-bold text-amber-400">BeeGo Hyperlocal Network</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

