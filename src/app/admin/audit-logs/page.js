'use client';

import React from 'react';
import { ScrollText, Shield } from 'lucide-react';

const AUDIT_LOGS = [
  {
    id: 'log-1',
    actor: 'admin@beegodelivery.in',
    role: 'admin',
    action: 'SYSTEM_BOOTSTRAP',
    target: 'Platform Core',
    details: 'Initial deployment and geofencing configuration established for Virajpete.',
    timestamp: '2026-10-28 18:45:00 IST',
  },
  {
    id: 'log-2',
    actor: 'admin@beegodelivery.in',
    role: 'admin',
    action: 'SERVICE_ZONE_UPDATE',
    target: 'Virajpete Central 5KM',
    details: 'Set default delivery radius to 5.0 km from Clock Tower (12.2039, 75.8037).',
    timestamp: '2026-10-28 19:10:00 IST',
  },
  {
    id: 'log-3',
    actor: 'manager@coorgheritage.in',
    role: 'store_manager',
    action: 'INVENTORY_STOCK_UPDATE',
    target: 'prod_pandi_curry_meal',
    details: 'Adjusted kitchen stock quantity to 25 meal boxes.',
    timestamp: '2026-10-28 19:25:00 IST',
  },
];

export default function AdminAuditLogsPage() {
  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Audit Logs</h1>
        <p className="text-xs text-slate-500 mt-1">
          Immutable security and operational trail of all administrative and merchant actions
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Actor</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Target</th>
                <th className="pb-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {AUDIT_LOGS.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60">
                  <td className="py-3 font-mono text-[11px] text-slate-400">{l.timestamp}</td>
                  <td className="py-3 font-bold text-slate-900">{l.actor}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {l.role}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-amber-700 text-[11px]">{l.action}</td>
                  <td className="py-3 text-slate-700">{l.target}</td>
                  <td className="py-3 text-slate-500 text-[11px] max-w-xs">{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

