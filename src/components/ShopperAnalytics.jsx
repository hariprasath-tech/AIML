import React from 'react';
import { Users, Clock, Flame, TrendingUp, ArrowUpRight, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function ShopperAnalytics({ footfallData, dwellTimeData, zoneHeatmap }) {
  const COLORS = ['#00F2FE', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Metric Cards Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span>TOTAL FOOTFALL (TODAY)</span>
            <Users size={16} color="var(--accent-cyan)" />
          </div>
          <div className="metric-value">1,482</div>
          <div className="metric-trend trend-up">
            <ArrowUpRight size={14} />
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        <div className="metric-card emerald">
          <div className="metric-header">
            <span>CURRENT OCCUPANCY</span>
            <Users size={16} color="var(--accent-emerald)" />
          </div>
          <div className="metric-value">34</div>
          <div className="metric-trend trend-up">
            <span>Optimal store capacity (65% max)</span>
          </div>
        </div>

        <div className="metric-card purple">
          <div className="metric-header">
            <span>AVG. SHOPPER DWELL TIME</span>
            <Clock size={16} color="var(--accent-purple)" />
          </div>
          <div className="metric-value">18.4 <span style={{ fontSize: '1rem' }}>mins</span></div>
          <div className="metric-trend trend-up">
            <ArrowUpRight size={14} />
            <span>+2.1 mins high engagement</span>
          </div>
        </div>

        <div className="metric-card amber">
          <div className="metric-header">
            <span>HOTSPOT ZONE</span>
            <Flame size={16} color="var(--accent-amber)" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.4rem', marginTop: '4px' }}>Dairy & Beverage</div>
          <div className="metric-trend">
            <span>34% total store dwell time</span>
          </div>
        </div>
      </div>

      {/* Hourly Footfall Chart & Dwell Time by Zone */}
      <div className="grid-2">
        {/* Footfall Area Chart */}
        <div className="glass-card">
          <div className="card-title">
            <div className="card-title-left">
              <TrendingUp size={18} className="card-title-icon" />
              <span>Hourly Shopper Traffic & Footfall Trend</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Updated Live</span>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={footfallData}>
                <defs>
                  <linearGradient id="footfallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00F2FE" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0F172A', borderColor: 'rgba(0, 242, 254, 0.4)', borderRadius: '10px' }}
                  itemStyle={{ color: '#00F2FE' }}
                />
                <Area type="monotone" dataKey="count" stroke="#00F2FE" strokeWidth={2.5} fillOpacity={1} fill="url(#footfallGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dwell Time per Zone Bar Chart */}
        <div className="glass-card">
          <div className="card-title">
            <div className="card-title-left">
              <MapPin size={18} className="card-title-icon" style={{ color: 'var(--accent-purple)' }} />
              <span>Average Dwell Time by Zone (Mins)</span>
            </div>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dwellTimeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="zone" type="category" stroke="#94A3B8" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ background: '#0F172A', borderColor: 'rgba(139, 92, 246, 0.4)', borderRadius: '10px' }}
                  itemStyle={{ color: '#8B5CF6' }}
                />
                <Bar dataKey="minutes" radius={[0, 6, 6, 0]}>
                  {dwellTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Store Floorplan Traffic Heatmap Grid */}
      <div className="glass-card">
        <div className="card-title">
          <div className="card-title-left">
            <Flame size={18} className="card-title-icon" style={{ color: 'var(--accent-rose)' }} />
            <span>Store Floor Traffic Heatmap Matrix (Live CCTV Intensity)</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Low Traffic</span>
            <div style={{ width: '80px', height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, #10B981, #F59E0B, #F43F5E)' }}></div>
            <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>High Traffic</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
          marginTop: '10px'
        }}>
          {zoneHeatmap.map((zone, idx) => (
            <div
              key={idx}
              style={{
                background: zone.intensity > 75 
                  ? 'rgba(244, 63, 94, 0.15)' 
                  : zone.intensity > 40 
                  ? 'rgba(245, 158, 11, 0.15)' 
                  : 'rgba(16, 185, 129, 0.15)',
                border: `1px solid ${
                  zone.intensity > 75 
                    ? 'var(--accent-rose)' 
                    : zone.intensity > 40 
                    ? 'var(--accent-amber)' 
                    : 'var(--accent-emerald)'
                }`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFF' }}>{zone.name}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: zone.intensity > 75 ? 'var(--accent-rose)' : '#FFF' }}>
                {zone.intensity}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Avg {zone.shoppers} active shoppers
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
