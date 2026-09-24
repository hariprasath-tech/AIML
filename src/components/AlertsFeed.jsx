import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2, ShieldAlert, Filter, Check } from 'lucide-react';

export default function AlertsFeed({ alerts, onAcknowledgeAlert, onClearAllAlerts }) {
  const [filter, setFilter] = useState('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    return a.severity === filter;
  });

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="card-title">
        <div className="card-title-left">
          <Bell size={18} className="card-title-icon" style={{ color: 'var(--accent-rose)' }} />
          <span>Real-Time Operational Alerts & Incident Log</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Filter Pills */}
          {['ALL', 'HIGH', 'WARNING', 'INFO'].map((f) => (
            <button
              key={f}
              className={`toggle-pill ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              style={{ fontSize: '0.72rem', padding: '4px 10px' }}
            >
              {f}
            </button>
          ))}

          {alerts.length > 0 && (
            <button
              className="btn btn-secondary"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              onClick={onClearAllAlerts}
            >
              <Check size={13} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle2 size={32} color="var(--accent-emerald)" style={{ marginBottom: '8px' }} />
          <div>All clear! No active system alerts at this moment.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`alert-card ${alert.severity}`}>
              <div className="alert-icon">
                {alert.severity === 'HIGH' ? (
                  <ShieldAlert size={18} color="var(--accent-rose)" />
                ) : alert.severity === 'WARNING' ? (
                  <AlertTriangle size={18} color="var(--accent-amber)" />
                ) : (
                  <Info size={18} color="var(--accent-cyan)" />
                )}
              </div>

              <div className="alert-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="alert-title">{alert.title}</span>
                  <span className="alert-time">{alert.timestamp}</span>
                </div>
                <p className="alert-desc">{alert.description}</p>
              </div>

              <button
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                onClick={() => onAcknowledgeAlert(alert.id)}
              >
                Ack
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
