import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, Trash2, Filter } from 'lucide-react';
import { useLiveData } from '../context/useLiveData';

export const AlertsFeed = () => {
  const { alerts, acknowledgeAlert, dismissAlert } = useLiveData();
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const severities = ['ALL', 'HIGH', 'WARNING', 'INFO'];

  const filteredAlerts = alerts.filter((alt) => {
    const matchesSev = severityFilter === 'ALL' || alt.severity === severityFilter;
    const matchesStat = statusFilter === 'ALL' || alt.status === statusFilter;
    return matchesSev && matchesStat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card glow-rose">
        <div className="card-title-row">
          <div className="card-title">
            <Bell color="var(--accent-rose)" size={20} />
            <span>Real-time Alert Notification Feed</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="store-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
            </select>
          </div>
        </div>

        {/* Severity Filter Chips */}
        <div className="shelf-filters" style={{ marginBottom: 0 }}>
          {severities.map((sev) => (
            <button
              key={sev}
              className={`filter-chip ${severityFilter === sev ? 'active' : ''}`}
              onClick={() => setSeverityFilter(sev)}
            >
              {sev === 'ALL' ? 'All Severities' : `${sev} Severity`}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <ShieldAlert size={36} style={{ marginBottom: '10px', color: 'var(--accent-emerald)' }} />
            <div>No alerts matching current filter criteria. System operating normally!</div>
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div key={alt.id} className={`alert-item ${alt.severity}`}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background:
                      alt.severity === 'HIGH'
                        ? 'rgba(244,63,94,0.15)'
                        : alt.severity === 'WARNING'
                        ? 'rgba(245,158,11,0.15)'
                        : 'rgba(0,242,254,0.15)',
                    color:
                      alt.severity === 'HIGH'
                        ? 'var(--accent-rose)'
                        : alt.severity === 'WARNING'
                        ? 'var(--accent-amber)'
                        : 'var(--accent-cyan)'
                  }}
                >
                  <Bell size={20} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.02rem', color: '#fff' }}>{alt.title}</span>
                    <span className={`status-badge ${alt.severity}`}>{alt.severity}</span>
                    {alt.status === 'ACKNOWLEDGED' && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                        ✓ ACKNOWLEDGED
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {alt.description}
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                    Type: {alt.type} · Detected: {alt.timestamp}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {alt.status === 'ACTIVE' && (
                  <button className="alert-action-btn" onClick={() => acknowledgeAlert(alt.id)}>
                    <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Acknowledge
                  </button>
                )}
                <button
                  className="alert-action-btn"
                  onClick={() => dismissAlert(alt.id)}
                  style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.2)' }}
                >
                  <Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsFeed;
