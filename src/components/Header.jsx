import React from 'react';
import { Camera, Cpu, Bell, Shield, Store, Zap, RefreshCw } from 'lucide-react';

export default function Header({ 
  selectedStore, 
  setSelectedStore, 
  fps, 
  latency, 
  unreadAlertsCount,
  onResetDemo 
}) {
  return (
    <header className="telemetry-header">
      <div className="brand-section">
        <div className="brand-icon">
          <Zap size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="brand-title">AURA Retail Vision</h1>
            <span className="sih-badge">SIH 2026 AI/ML</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Privacy-First Edge Retail Intelligence Engine
          </div>
        </div>
      </div>

      <div className="header-status-bar">
        {/* Store Selector */}
        <div className="status-item" style={{ cursor: 'pointer' }}>
          <Store size={15} color="var(--accent-cyan)" />
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="store-101" style={{ background: '#0F172A' }}>Store #101 - Supermart Indiranagar, BLR</option>
            <option value="store-102" style={{ background: '#0F172A' }}>Store #102 - Express Mart Koramangala, BLR</option>
            <option value="store-103" style={{ background: '#0F172A' }}>Store #103 - HyperMarket Whitefield, BLR</option>
          </select>
        </div>

        {/* Edge AI Engine Telemetry */}
        <div className="status-item">
          <div className="pulse-indicator"></div>
          <Cpu size={15} color="var(--accent-emerald)" />
          <span>YOLOv8 Edge | <strong>{fps.toFixed(1)} FPS</strong> | <strong>{latency.toFixed(1)}ms</strong></span>
        </div>

        {/* Privacy Shield Indicator */}
        <div className="status-item" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.08)' }}>
          <Shield size={15} color="var(--accent-emerald)" />
          <span style={{ color: 'var(--accent-emerald)' }}>Zero Face Save Active</span>
        </div>

        {/* Reset Demo State Button */}
        <button className="btn btn-secondary" onClick={onResetDemo} title="Reset AI Data Stream">
          <RefreshCw size={14} />
          Reset Demo
        </button>
      </div>
    </header>
  );
}
