import React, { useState } from 'react';
import { ShieldCheck, Cpu, Sliders, HardDrive, Lock, Server, CheckCircle2 } from 'lucide-react';

export default function PrivacyConfig({ fps, latency }) {
  const [privacyBlur, setPrivacyBlur] = useState(true);
  const [autoDeleteVideo, setAutoDeleteVideo] = useState(true);
  const [anonymousIDs, setAnonymousIDs] = useState(true);
  const [confThreshold, setConfThreshold] = useState(0.5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="grid-2">
        {/* Privacy & Ethics Compliance Settings */}
        <div className="glass-card">
          <div className="card-title">
            <div className="card-title-left">
              <Lock size={18} className="card-title-icon" style={{ color: 'var(--accent-emerald)' }} />
              <span>Privacy-First Architecture & Data Protection</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              SIH COMPLIANT
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFF' }}>Zero Face Disk Storage</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Faces are never recorded, analyzed for identity, or written to storage.</div>
              </div>
              <input
                type="checkbox"
                checked={privacyBlur}
                onChange={(e) => setPrivacyBlur(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFF' }}>Auto-Delete Uploaded Video Buffer</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Video frames are purged immediately from RAM after inference.</div>
              </div>
              <input
                type="checkbox"
                checked={autoDeleteVideo}
                onChange={(e) => setAutoDeleteVideo(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFF' }}>Ephemeral Anonymous Object Tracking IDs</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ByteTrack assigns temporary integer hashes that reset when shoppers exit.</div>
              </div>
              <input
                type="checkbox"
                checked={anonymousIDs}
                onChange={(e) => setAnonymousIDs(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Edge AI Engine Benchmarking */}
        <div className="glass-card">
          <div className="card-title">
            <div className="card-title-left">
              <Cpu size={18} className="card-title-icon" style={{ color: 'var(--accent-cyan)' }} />
              <span>Edge AI Engine Benchmarking</span>
            </div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              QUALCOMM OR ONNX CPU
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="metrics-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '12px', background: 'rgba(15,23,42,0.6)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>INFERENCE LATENCY</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  {latency.toFixed(1)} ms
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(15,23,42,0.6)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>INFERENCE FPS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
                  {fps.toFixed(1)}
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Detection Confidence Threshold ({confThreshold})</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={confThreshold}
                onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'rgba(0, 242, 254, 0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
              💡 <strong>Edge Optimization Note:</strong> Models are compiled using ONNX Runtime with INT8 quantization, allowing real-time 30 FPS inference on standard CPU / Snapdragon processors without requiring high-end GPUs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
