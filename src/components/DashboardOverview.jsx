import React from 'react';
import { Users, Clock, AlertTriangle, Activity, PackageSearch, Cpu, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLiveData } from '../context/useLiveData';
import KpiCard from './KpiCard';
import LiveFeed from './LiveFeed';
import Heatmap from './Heatmap';

export const DashboardOverview = ({ onNavigate }) => {
  const { kpiMetrics, hourlyFootfallData, counters, alerts, modelMetrics, wsConnected } = useLiveData();

  const latestAlerts = alerts.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards Row */}
      <div className="kpi-grid">
        <KpiCard
          title="Current Footfall"
          value={kpiMetrics.activeShoppers}
          unit="people"
          trend={kpiMetrics.footfallTrend}
          icon={Users}
          theme="cyan"
          subtitle="Active shoppers inside store"
        />
        <KpiCard
          title="Avg Dwell Time"
          value={kpiMetrics.avgDwellTimeMins}
          unit="mins"
          trend={kpiMetrics.dwellTrend}
          icon={Clock}
          theme="purple"
          subtitle="Time spent per zone"
        />
        <KpiCard
          title="Avg Queue Wait"
          value={kpiMetrics.avgQueueWaitMins}
          unit="mins"
          trend={kpiMetrics.queueWaitTrend}
          icon={Clock}
          theme="amber"
          subtitle="Billing counter delay"
        />
        <KpiCard
          title="Stock-outs Today"
          value={kpiMetrics.stockOutsCount}
          unit="shelves"
          trend={kpiMetrics.stockOutsTrend}
          icon={PackageSearch}
          theme="rose"
          subtitle="Empty shelves detected"
        />
      </div>

      {/* Model Performance Card (Trained on synthetic data) */}
      <div
        className="glass-card glow-cyan"
        style={{
          padding: '16px 20px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={18} color="var(--accent-cyan, #00F2FE)" />
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>Model Performance</span>
            <span
              style={{
                background: 'rgba(0, 242, 254, 0.12)',
                color: 'var(--accent-cyan, #00F2FE)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}
            >
              Trained on synthetic data
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: wsConnected ? '#10B981' : '#F59E0B'
              }}
            />
            <span style={{ color: wsConnected ? '#10B981' : 'var(--text-muted, #94A3B8)', fontWeight: 600 }}>
              {wsConnected ? 'Live WebSocket Connected (2s inference)' : 'Fallback Simulation Mode'}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '12px'
          }}
        >
          {/* Metric 1: Queue Wait MAE */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94A3B8)', fontWeight: 500 }}>
              Queue Wait-Time (LGBM)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan, #00F2FE)', fontFamily: 'var(--font-mono)' }}>
                {modelMetrics?.queue_wait_regression?.test_mae ?? 0.316}m
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #CBD5E1)' }}>MAE</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted, #64748B)', marginTop: '2px' }}>
              RMSE: {modelMetrics?.queue_wait_regression?.test_rmse ?? 0.833}m (Baseline MAE: {modelMetrics?.queue_wait_regression?.baseline_mae ?? 3.396}m)
            </div>
          </div>

          {/* Metric 2: Queue Congestion F1 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94A3B8)', fontWeight: 500 }}>
              Queue Congestion (3-Class)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-purple, #A855F7)', fontFamily: 'var(--font-mono)' }}>
                {modelMetrics?.queue_congestion_classification?.test_macro_f1 ?? 0.957}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #CBD5E1)' }}>Macro-F1</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted, #64748B)', marginTop: '2px' }}>
              Acc: {((modelMetrics?.queue_congestion_classification?.test_accuracy ?? 0.961) * 100).toFixed(1)}% (Baseline F1: {modelMetrics?.queue_congestion_classification?.baseline_macro_f1 ?? 0.207})
            </div>
          </div>

          {/* Metric 3: Shelf Status F1 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94A3B8)', fontWeight: 500 }}>
              Shelf Status (FULL/LOW/OUT)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald, #10B981)', fontFamily: 'var(--font-mono)' }}>
                {modelMetrics?.shelf_status_classification?.test_macro_f1 ?? 0.990}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #CBD5E1)' }}>Macro-F1</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted, #64748B)', marginTop: '2px' }}>
              Acc: {((modelMetrics?.shelf_status_classification?.test_accuracy ?? 0.993) * 100).toFixed(1)}% (Baseline F1: {modelMetrics?.shelf_status_classification?.baseline_macro_f1 ?? 0.256})
            </div>
          </div>

          {/* Metric 4: Footfall Forecast MAE */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94A3B8)', fontWeight: 500 }}>
              Footfall 1h Forecast (LGBM)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber, #F59E0B)', fontFamily: 'var(--font-mono)' }}>
                {modelMetrics?.footfall_forecast_regression?.test_mae ?? 3.192}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #CBD5E1)' }}>MAE</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted, #64748B)', marginTop: '2px' }}>
              RMSE: {modelMetrics?.footfall_forecast_regression?.test_rmse ?? 4.523} (Baseline MAE: {modelMetrics?.footfall_forecast_regression?.baseline_mae ?? 7.487})
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live AI Camera Feed + Queue Status Panel */}
      <div className="dashboard-grid">
        {/* Live Video Camera Feed */}
        <LiveFeed />

        {/* Live Counters Quick Monitor */}
        <div className="glass-card glow-purple" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="card-title-row">
            <div className="card-title">
              <Clock color="var(--accent-purple)" size={20} />
              <span>Checkout Queue Status</span>
            </div>
            <button
              onClick={() => onNavigate('queue')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
            >
              View Details →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {counters.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staff: {c.activeStaff}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {c.queueLength} in queue
                  </div>
                  <span className={`counter-status ${c.status}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stat Footer */}
          <div style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            💡 Peak congestion expected around 19:00 IST
          </div>
        </div>
      </div>

      {/* Hourly Footfall Chart */}
      <div className="glass-card glow-cyan">
        <div className="card-title-row">
          <div className="card-title">
            <Activity color="var(--accent-cyan)" size={20} />
            <span>Hourly Footfall Trajectory</span>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
          >
            Full Analytics →
          </button>
        </div>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyFootfallData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dashToday" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00F2FE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="#64748B" style={{ fontSize: '0.78rem' }} />
              <YAxis stroke="#64748B" style={{ fontSize: '0.78rem' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#FFF'
                }}
              />
              <Area type="monotone" dataKey="today" name="Today Shoppers" stroke="#00F2FE" strokeWidth={2.5} fillOpacity={1} fill="url(#dashToday)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Floor Heatmap & Latest Alerts Feed */}
      <div className="dashboard-grid">
        <Heatmap />

        {/* Latest Alerts */}
        <div className="glass-card glow-rose">
          <div className="card-title-row">
            <div className="card-title">
              <AlertTriangle color="var(--accent-rose)" size={20} />
              <span>Latest AI Alerts</span>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
            >
              All Alerts →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {latestAlerts.map((alt) => (
              <div
                key={alt.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${
                    alt.severity === 'HIGH'
                      ? 'var(--accent-rose)'
                      : alt.severity === 'WARNING'
                      ? 'var(--accent-amber)'
                      : 'var(--accent-cyan)'
                  }`
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{alt.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {alt.description}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  {alt.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
