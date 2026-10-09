import React from 'react';
import { Clock, Zap, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLiveData } from '../context/useLiveData';
import KpiCard from './KpiCard';

export const QueueMonitor = () => {
  const { counters, waitTimeTrendData, kpiMetrics } = useLiveData();

  const congestedCounters = counters.filter((c) => c.status === 'CONGESTED');
  const closedCounters = counters.filter((c) => c.status === 'CLOSED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Queue KPIs */}
      <div className="kpi-grid">
        <KpiCard
          title="Avg Queue Wait Time"
          value={kpiMetrics.avgQueueWaitMins}
          unit="mins"
          trend={kpiMetrics.queueWaitTrend}
          icon={Clock}
          theme="amber"
          subtitle="Real-time queue timing"
        />
        <KpiCard
          title="Congested Counters"
          value={congestedCounters.length}
          unit="counters"
          trend={0}
          icon={AlertCircle}
          theme="rose"
          subtitle="Exceeding 4 person threshold"
        />
        <KpiCard
          title="Active Open Counters"
          value={counters.length - closedCounters.length}
          unit="counters"
          trend={0}
          icon={Users}
          theme="emerald"
          subtitle="Staffed & self-checkout"
        />
      </div>

      {/* AI Recommendation Banner */}
      {congestedCounters.length > 0 && closedCounters.length > 0 && (
        <div className="ai-banner">
          <div className="ai-banner-icon">
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
              ⚡ AI Recommendation: High Wait Time Detected at {congestedCounters[0].name}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
              Queue length reached {congestedCounters[0].queueLength} shoppers. Open{' '}
              <strong>{closedCounters[0].name}</strong> to reduce average wait time by ~4.2 mins.
            </div>
          </div>
        </div>
      )}

      {/* Counter Grid */}
      <div className="counter-grid">
        {counters.map((cntr) => (
          <div key={cntr.id} className="counter-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{cntr.name}</span>
              <span className={`counter-status ${cntr.status}`}>{cntr.status}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                {cntr.queueLength}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>shoppers in queue</span>
            </div>

            {/* Queue Avatars Representation */}
            <div className="queue-avatars">
              {Array.from({ length: Math.min(6, cntr.queueLength) }).map((_, i) => (
                <div key={i} className="queue-avatar-dot">
                  👤
                </div>
              ))}
              {cntr.queueLength > 6 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                  +{cntr.queueLength - 6} more
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Staff: {cntr.activeStaff}</span>
              <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>~{cntr.avgWaitTime} mins wait</span>
            </div>
          </div>
        ))}
      </div>

      {/* Wait Time Trend & 15-Minute Congestion Forecast Chart */}
      <div className="glass-card glow-cyan">
        <div className="card-title-row">
          <div className="card-title">
            <TrendingUp color="var(--accent-cyan)" size={20} />
            <span>Live Wait-Time Trend & 15-Min Congestion Forecast</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ color: '#00F2FE' }}>━ Actual Wait Time</span> |{' '}
            <span style={{ color: '#F43F5E' }}>--- 15m AI Forecast (Dashed)</span>
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waitTimeTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="#64748B" style={{ fontSize: '0.78rem' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '0.78rem' }} unit="m" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#FFF'
                }}
              />
              <Line type="monotone" dataKey="actual" name="Actual Wait (mins)" stroke="#00F2FE" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="forecast" name="Forecast Wait (mins)" stroke="#F43F5E" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QueueMonitor;
