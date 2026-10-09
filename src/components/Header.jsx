import React from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { user, logout, faceBlurEnabled, toggleFaceBlur, wsConnected } = useApp();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Title & Project Code Header */}
      <div>
        <h1 className="text-base font-semibold text-slate-900 tracking-tight leading-tight">
          AI-Powered Retail Intelligence Platform with Shopper Analytics, Inventory Visibility and Queue Management
        </h1>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
          <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
            Project No: 60
          </span>
          <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
            Code: 25CS062
          </span>
          <span className="flex items-center gap-1.5 ml-2">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            {wsConnected ? 'Live Connection' : 'Reconnecting...'}
          </span>
        </div>
      </div>

      {/* Right Header Status & Controls */}
      <div className="flex items-center gap-4">
        {/* Face Blur Toggle Badge */}
        <button
          onClick={toggleFaceBlur}
          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-2 cursor-pointer ${
            faceBlurEnabled
              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
          title="Toggle privacy face blur on backend video processing"
        >
          <span className={`w-2 h-2 rounded-full ${faceBlurEnabled ? 'bg-blue-600' : 'bg-slate-400'}`} />
          {faceBlurEnabled ? 'Face blur ON' : 'Face blur OFF'}
        </button>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4 text-xs">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-slate-900">{user.full_name || user.username}</p>
              <p className="text-slate-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded text-xs transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
