import React from 'react';

export default function LoadingState({ message = "Loading data..." }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
      <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-3"></div>
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
