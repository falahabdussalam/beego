import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#380611] text-[#FDFBF7]/80 pt-16 pb-12 border-t border-[#58111E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#58111E]">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#58111E]/80 p-3 rounded-2xl inline-block border border-[#7A162D]/60">
              <Logo showTagline={true} />
            </div>
            <p className="text-sm text-[#FDFBF7]/75 max-w-sm leading-relaxed">
              BeeGo is the premier hyperlocal delivery platform for Virajpete and surrounding Kodagu areas. Delivering fresh groceries, restaurant meals, medicines, daily essentials, and fresh dairy directly to your doorstep in minutes.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-[#FAF5EC]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>100% Genuine Products • Local Virajpete Merchants</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-[#FDFBF7] uppercase tracking-wider mb-4">
              Daily Essentials
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FDFBF7]/70">
              <li>
                <Link href="/categories/food-dining" className="hover:text-white transition-colors">
                  Food & Restaurants
                </Link>
              </li>
              <li>
                <Link href="/categories/groceries" className="hover:text-white transition-colors">
                  Groceries & Staples
                </Link>
              </li>
              <li>
                <Link href="/categories/fruits-vegetables" className="hover:text-white transition-colors">
                  Fresh Fruits & Veggies
                </Link>
              </li>
              <li>
                <Link href="/categories/pharmacy-medicines" className="hover:text-white transition-colors">
                  Pharmacy & Healthcare
                </Link>
              </li>
              <li>
                <Link href="/categories/milk-dairy" className="hover:text-white transition-colors">
                  Fresh Milk & Dairy
                </Link>
              </li>
              <li>
                <Link href="/categories/beverages-snacks" className="hover:text-white transition-colors">
                  Beverages & Snacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer & Company Links */}
          <div>
            <h3 className="text-xs font-bold text-[#FDFBF7] uppercase tracking-wider mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FDFBF7]/70">
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Delivery Cart
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="hover:text-white transition-colors text-white/50 hover:text-white">
                  Admin Panel (Products &amp; Stock)
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Area & Support */}
          <div>
            <h3 className="text-xs font-bold text-[#FDFBF7] uppercase tracking-wider mb-4">
              Virajpete Hub
            </h3>
            <ul className="space-y-3 text-xs text-[#FDFBF7]/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FDFBF7] shrink-0 mt-0.5" />
                <span>Clock Tower Main Road, Virajpete, Kodagu, Karnataka - 571218</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FDFBF7] shrink-0" />
                <span>Operating Hours: 07:00 AM - 10:30 PM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FDFBF7] shrink-0" />
                <span>+91 8274 256789</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FDFBF7] shrink-0" />
                <span>support@beegodelivery.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Prescription Compliance Note */}
        <div className="py-6 border-b border-[#58111E] text-[11px] text-[#FDFBF7]/60 leading-relaxed">
          <p className="font-semibold text-[#FDFBF7]/80 mb-1">
            Regulatory Disclosure & Pharmacy Compliance:
          </p>
          <p>
            BeeGo acts as a technology intermediary connecting consumers with licensed local pharmacies and stores in Virajpete, Kodagu. Regulated pharmaceutical products (Schedule H/H1) strictly require a valid registered medical practitioner prescription verified prior to dispensing in accordance with the Drugs and Cosmetics Act, 1940 and Pharmacy Practice Regulations.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FDFBF7]/60 gap-4">
          <p>
            © {new Date().getFullYear()} BeeGo Delivery. All rights reserved. Crafted for Virajpete, Kodagu.
          </p>
          <p className="flex items-center gap-1 text-[#FDFBF7]/70">
            <span>Powered by</span>
            <span className="font-bold text-[#FAF5EC]">BeeGo Hyperlocal Network</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
