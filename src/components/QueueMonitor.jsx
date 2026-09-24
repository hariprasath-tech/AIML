import React from 'react';
import { Clock, Users, AlertTriangle, CheckCircle, Zap, UserPlus, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import confetti from 'canvas-confetti';

export default function QueueMonitor({ queueData, forecastData, onOpenNewCounter }) {
  const triggerConfetti = (queueName) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    onOpenNewCounter(queueName);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Queue Cards Grid */}
      <div className="grid-3">
        {queueData.map((q) => {
          const isCongested = q.count >= q.threshold;

          return (
            <div
              key={q.id}
              className={`glass-card ${isCongested ? 'rose' : ''}`}
              style={{
                borderColor: isCongested ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-color)',
                boxShadow: isCongested ? 'var(--shadow-glow-rose)' : 'none'
              }}
            >
              <div className="card-title">
                <div className="card-title-left">
                  <Users size={18} className="card-title-icon" style={{ color: isCongested ? 'var(--accent-rose)' : 'var(--accent-cyan)' }} />
                  <span>{q.name}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: isCongested ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: isCongested ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                    border: `1px solid ${isCongested ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                  }}
                >
                  {isCongested ? 'CONGESTED' : 'NORMAL'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', my: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>QUEUE LENGTH</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#FFF' }}>
                    {q.count} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>people</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>EST. WAIT TIME</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isCongested ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                    {q.waitTime} <span style={{ fontSize: '0.8rem' }}>mins</span>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div style={{ display: 'flex', gap: '4px', margin: '12px 0' }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '3px',
                      background: i < q.count 
                        ? (i >= q.threshold ? 'var(--accent-rose)' : 'var(--accent-cyan)')
                        : 'rgba(255,255,255,0.08)'
                    }}
                  />
                ))}
              </div>

              {isCongested && (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                  onClick={() => triggerConfetti(q.name)}
                >
                  <UserPlus size={15} />
                  Open Counter #4 (Dispatch Cashier)
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Queue Forecast Line Chart */}
      <div className="glass-card">
        <div className="card-title">
          <div className="card-title-left">
            <TrendingUp size={18} className="card-title-icon" style={{ color: 'var(--accent-cyan)' }} />
            <span>AI 15-Minute Queue Congestion Forecast (Predictive Neural Model)</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            CONFIDENCE: 94.6%
          </span>
        </div>

        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ background: '#0F172A', borderColor: 'rgba(0, 242, 254, 0.4)', borderRadius: '10px' }}
              />
              <Line type="monotone" dataKey="actual" stroke="#00F2FE" strokeWidth={2.5} name="Current Length" />
              <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" name="AI Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
