import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Contact Support — BeeGo Delivery Virajpete',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Contact Customer Support</h1>
        <p className="text-xs text-slate-500 mt-1">We are based right here in Virajpete, Kodagu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Virajpete Dispatch Hub</h2>
          
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Clock Tower Main Road, Near Bus Stand, Virajpete, Kodagu, Karnataka - 571218</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Direct Support: <strong>+91 8274 256789</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Email: <strong>support@beegodelivery.in</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Operations: 07:00 AM - 10:30 PM (7 Days a week)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Merchant &amp; Partner Inquiries</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you a local restaurant owner, grocery store, licensed pharmacy, or independent delivery driver in Virajpete looking to partner with BeeGo?
          </p>
          <div className="space-y-2 text-xs">
            <p>Merchant Onboarding: <strong>partners@beegodelivery.in</strong></p>
            <p>Rider Support Hotline: <strong>+91 9480 334455</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

