import React from 'react';

export default function EmptyState({ title = "No data available", message = "There is no information to display for this selection." }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
      <p className="text-sm font-semibold text-slate-800 mb-1">{title}</p>
      <p className="text-xs text-slate-500 max-w-sm">{message}</p>
    </div>
  );
}
