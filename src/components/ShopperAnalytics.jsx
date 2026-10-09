import React from 'react';
import { Users, LogIn, LogOut, Clock, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useLiveData } from '../context/useLiveData';
import KpiCard from './KpiCard';
import Heatmap from './Heatmap';

export const ShopperAnalytics = () => {
  const { kpiMetrics, hourlyFootfallData, zoneDwellData } = useLiveData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Metrics Row */}
      <div className="kpi-grid">
        <KpiCard
          title="Active In-Store Shoppers"
          value={kpiMetrics.activeShoppers}
          unit="people"
          trend={kpiMetrics.footfallTrend}
          icon={Users}
          theme="cyan"
          subtitle="Real-time occupancy tracking"
        />
        <KpiCard
          title="Total Today Footfall"
          value={kpiMetrics.totalFootfallToday}
          unit="shoppers"
          trend={8.5}
          icon={LogIn}
          theme="purple"
          subtitle="Entry door camera count"
        />
        <KpiCard
          title="Average Dwell Time"
          value={kpiMetrics.avgDwellTimeMins}
          unit="mins"
          trend={kpiMetrics.dwellTrend}
          icon={Clock}
          theme="amber"
          subtitle="Time spent per customer"
        />
        <KpiCard
          title="Total Store Exits"
          value={Math.round(kpiMetrics.totalFootfallToday * 0.92)}
          unit="exits"
          trend={6.1}
          icon={LogOut}
          theme="emerald"
          subtitle="Exit door camera count"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="dashboard-grid">
        {/* Footfall Trend Area Chart */}
        <div className="glass-card glow-cyan">
          <div className="card-title-row">
            <div className="card-title">
              <Activity color="var(--accent-cyan)" size={20} />
              <span>Hourly Footfall Traffic (Today vs Yesterday)</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyFootfallData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="todayColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F2FE" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="yesterdayColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
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
                <Area type="monotone" dataKey="today" name="Today" stroke="#00F2FE" strokeWidth={2.5} fillOpacity={1} fill="url(#todayColor)" />
                <Area type="monotone" dataKey="yesterday" name="Yesterday" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#yesterdayColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Dwell Time Bar Chart */}
        <div className="glass-card glow-purple">
          <div className="card-title-row">
            <div className="card-title">
              <Clock color="var(--accent-purple)" size={20} />
              <span>Zone-wise Dwell Time (Minutes)</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneDwellData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="#64748B" style={{ fontSize: '0.78rem' }} />
                <YAxis dataKey="zone" type="category" stroke="#64748B" style={{ fontSize: '0.78rem' }} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFF'
                  }}
                />
                <Bar dataKey="dwellMins" name="Avg Mins" radius={[0, 6, 6, 0]} fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Floor Heatmap Grid */}
      <Heatmap />
    </div>
  );
};

export default ShopperAnalytics;
