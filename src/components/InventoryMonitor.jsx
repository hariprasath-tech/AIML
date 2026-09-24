import React from 'react';
import { ShoppingBag, AlertTriangle, CheckCircle, PackageX, RefreshCw, Layers } from 'lucide-react';

export default function InventoryMonitor({ shelfData, onTriggerRestock }) {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="card-title">
        <div className="card-title-left">
          <ShoppingBag size={18} className="card-title-icon" style={{ color: 'var(--accent-amber)' }} />
          <span>Real-Time Shelf Inventory & Stock-Out Visibility</span>
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
          AI COMPUTER VISION MONITORING
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {shelfData.map((shelf) => {
          const isOut = shelf.status === 'OUT OF STOCK';
          const isLow = shelf.status === 'LOW STOCK';

          return (
            <div
              key={shelf.id}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${
                  isOut ? 'rgba(244, 63, 94, 0.5)' : isLow ? 'rgba(245, 158, 11, 0.5)' : 'var(--border-color)'
                }`,
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: isOut ? '0 0 15px rgba(244, 63, 94, 0.15)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFF' }}>{shelf.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{shelf.location} · {shelf.sku}</div>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: isOut
                      ? 'rgba(244, 63, 94, 0.15)'
                      : isLow
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)',
                    color: isOut ? 'var(--accent-rose)' : isLow ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                    border: `1px solid ${
                      isOut ? 'rgba(244, 63, 94, 0.4)' : isLow ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'
                    }`
                  }}
                >
                  {shelf.status}
                </span>
              </div>

              {/* Progress Level Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shelf Stock Fill Level</span>
                  <span style={{ color: isOut ? 'var(--accent-rose)' : isLow ? 'var(--accent-amber)' : 'var(--accent-emerald)', fontWeight: 700 }}>
                    {shelf.fillPercent}%
                  </span>
                </div>

                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${shelf.fillPercent}%`,
                      height: '100%',
                      background: isOut
                        ? 'var(--accent-rose)'
                        : isLow
                        ? 'linear-gradient(90deg, #F59E0B, #FFB800)'
                        : 'linear-gradient(90deg, #10B981, #00F5A0)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>

              {/* Action and Camera Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  CCTV: {shelf.camera} · Conf: {shelf.confidence}%
                </span>

                {(isOut || isLow) && (
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: isOut ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-color)' }}
                    onClick={() => onTriggerRestock(shelf.id)}
                  >
                    <RefreshCw size={12} />
                    Restock Alert
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
