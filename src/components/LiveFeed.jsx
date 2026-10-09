import React, { useState } from 'react';
import { Camera, Eye, Layers, ShieldCheck, Video } from 'lucide-react';
import { useLiveData } from '../context/useLiveData';

export const LiveFeed = () => {
  const { cameras, boundingBoxes } = useLiveData();
  const [selectedCam, setSelectedCam] = useState(cameras[0].id);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const currentCam = cameras.find((c) => c.id === selectedCam) || cameras[0];

  return (
    <div className="glass-card glow-cyan">
      <div className="card-title-row">
        <div className="card-title">
          <Video color="var(--accent-cyan)" size={20} />
          <span>Live AI Camera Feed - {currentCam.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            className="store-select"
            value={selectedCam}
            onChange={(e) => setSelectedCam(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px' }}
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camera Canvas / Simulation Container */}
      <div className="feed-container">
        {/* Background Simulated Store Image */}
        <img
          src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1000&auto=format&fit=crop&q=80"
          alt="Live Feed Store"
          className="feed-canvas"
          style={{ opacity: showHeatmap ? 0.6 : 0.85, filter: 'brightness(0.85) contrast(1.1)' }}
        />

        {/* Heatmap Overlay Layer */}
        {showHeatmap && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 40% 40%, rgba(244, 63, 94, 0.45) 0%, rgba(245, 158, 11, 0.3) 35%, rgba(0, 242, 254, 0.15) 70%, transparent 100%)',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* AI Bounding Box Overlays */}
        {showBoxes &&
          boundingBoxes.map((box) => (
            <div
              key={box.id}
              style={{
                position: 'absolute',
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
                border: box.type === 'Staff' ? '2px dashed var(--accent-purple)' : '2px solid var(--accent-cyan)',
                borderRadius: '6px',
                boxShadow: box.type === 'Staff' ? '0 0 12px rgba(139, 92, 246, 0.5)' : '0 0 12px rgba(0, 242, 254, 0.5)',
                transition: 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4px',
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  background: box.type === 'Staff' ? 'var(--accent-purple)' : 'var(--accent-cyan)',
                  color: '#000',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  alignSelf: 'flex-start',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {box.id} ({box.type})
              </div>

              {/* Anonymous Skeleton overlay lines simulation */}
              {showSkeleton && (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <svg width="100%" height="100%" style={{ stroke: 'rgba(255,255,255,0.7)', strokeWidth: 1.5 }}>
                    <line x1="50%" y1="15%" x2="50%" y2="55%" />
                    <line x1="20%" y1="30%" x2="80%" y2="30%" />
                    <line x1="50%" y1="55%" x2="30%" y2="95%" />
                    <line x1="50%" y1="55%" x2="70%" y2="95%" />
                  </svg>
                </div>
              )}

              <div
                style={{
                  background: 'rgba(0,0,0,0.75)',
                  color: '#fff',
                  fontSize: '0.62rem',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  alignSelf: 'flex-end',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Dwell: {box.dwell}
              </div>
            </div>
          ))}

        {/* Privacy Watermark Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(8, 12, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--accent-emerald)'
          }}
        >
          <ShieldCheck size={14} />
          <span>Edge Processing · No Face Storage</span>
        </div>

        {/* Telemetry OSD Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'rgba(8, 12, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)'
          }}
        >
          RTSP 1080p @ {currentCam.fps} FPS | Tracked: {boundingBoxes.length} Objects
        </div>
      </div>

      {/* Control Toggles */}
      <div className="feed-controls">
        <div className="toggle-group">
          <button
            className={`toggle-btn ${showBoxes ? 'active' : ''}`}
            onClick={() => setShowBoxes(!showBoxes)}
          >
            <Eye size={14} />
            <span>Bounding Boxes</span>
          </button>
          <button
            className={`toggle-btn ${showHeatmap ? 'active' : ''}`}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            <Layers size={14} />
            <span>Heatmap Overlay</span>
          </button>
          <button
            className={`toggle-btn ${showSkeleton ? 'active' : ''}`}
            onClick={() => setShowSkeleton(!showSkeleton)}
          >
            <Camera size={14} />
            <span>Anonymous Skeleton</span>
          </button>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          AI Model: <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>YOLOv8 + ByteTrack</span>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
