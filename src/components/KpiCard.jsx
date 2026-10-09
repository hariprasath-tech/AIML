import React from 'react';

export default function KpiCard({ title, value, subtitle, status, statusColor = 'bg-slate-100 text-slate-700' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</span>
        {status && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200 ${statusColor}`}>
            {status}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}
