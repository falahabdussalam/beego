'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { subscribeSyncEvents } from '../../lib/sync';

export default function AnnouncementBanner() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings && data.settings.announcement?.enabled && data.settings.announcement?.text) {
          setAnnouncement(data.settings.announcement);
        } else {
          setAnnouncement(null);
        }
      }
    } catch (e) {
      // Ignored
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen for live updates from Admin Dashboard
    const unsubscribe = subscribeSyncEvents((event) => {
      if (event.type === 'SETTINGS_UPDATED') {
        fetchSettings();
        setDismissed(false); // Reset dismissal if admin posted fresh announcement
      }
    });

    return () => unsubscribe();
  }, []);

  if (pathname?.startsWith('/admin')) return null;
  if (!announcement || dismissed) return null;

  const bgStyles = {
    info: 'bg-[#58111E] text-[#FDFBF7] border-b border-[#7A162D]',
    warning: 'bg-amber-600 text-amber-50 border-b border-amber-700',
    success: 'bg-emerald-700 text-emerald-50 border-b border-emerald-800',
  }[announcement.type || 'info'];

  const Icon = {
    info: Sparkles,
    warning: AlertCircle,
    success: CheckCircle2,
  }[announcement.type || 'info'];

  return (
    <div className={`${bgStyles} px-4 py-2 text-xs font-semibold relative transition-all animate-in fade-in slide-in-from-top-2 z-50`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 justify-center text-center">
          <Icon className="w-4 h-4 shrink-0 text-amber-300" />
          <span className="truncate sm:overflow-visible sm:whitespace-normal">
            {announcement.text}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md hover:bg-black/20 text-white/80 hover:text-white transition-colors shrink-0"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
