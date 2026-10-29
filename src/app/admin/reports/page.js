'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Download, RefreshCw, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);
    fetch('/api/admin/reports')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setReport(data))
      .catch((e) => console.warn(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownloadCSV = () => {
    window.location.href = '/api/admin/reports?format=csv';
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sales &amp; Analytics Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate revenue, order volumes, and financial export for Virajpete operations
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all self-start"
        >
          <Download className="w-4 h-4" />
          <span>Export Sales CSV</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
          <div className="text-2xl font-black text-slate-900">
            ₹{report?.summary?.totalSales?.toLocaleString('en-IN') || '0.00'}
          </div>
          <p className="text-[11px] text-slate-500">Gross completed &amp; active order total</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders Logged</span>
          <div className="text-2xl font-black text-slate-900">
            {report?.summary?.totalOrders || 0}
          </div>
          <p className="text-[11px] text-slate-500">All customer checkout orders in database</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fulfillment Hub</span>
          <div className="text-2xl font-black text-amber-600">
            Virajpete 5KM
          </div>
          <p className="text-[11px] text-slate-500">Kodagu Central Service Zone</p>
        </div>
      </div>

      {/* Orders Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Order Status Distribution
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {report?.summary?.ordersByStatus &&
            Object.entries(report.summary.ordersByStatus).map(([st, count]) => (
              <div key={st} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block truncate">
                  {st.replace(/_/g, ' ')}
                </span>
                <span className="text-lg font-black text-slate-900">{count}</span>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}

