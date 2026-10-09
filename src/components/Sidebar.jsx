import React from 'react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cameras', label: 'Live Cameras' },
    { id: 'queue', label: 'Queue Management' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'metrics', label: 'Model Performance' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-57px)] p-4 flex flex-col justify-between shrink-0">
      <nav className="space-y-1">
        <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1 px-2">
        <p className="font-semibold text-slate-700">Retail AI Engine</p>
        <p>YOLOv8s + ByteTrack</p>
        <p className="text-[11px] text-slate-400 mt-2">v1.0.0 Stable</p>
      </div>
    </aside>
  );
}
