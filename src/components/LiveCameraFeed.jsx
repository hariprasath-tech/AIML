import React, { useState, useEffect, useRef } from 'react';
import { Camera, Eye, EyeOff, Layers, Shield, Play, Pause, AlertTriangle, Maximize2, Settings, Zap } from 'lucide-react';

export default function LiveCameraFeed({ activeCamera, setActiveCamera, shoppersCount, queueLength, shelfStatus }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showPrivacyBlur, setShowPrivacyBlur] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showTrajectories, setShowTrajectories] = useState(true);
  
  // Simulated tracking targets
  const targetsRef = useRef([
    { id: 'P-102', x: 120, y: 140, vx: 1.2, vy: 0.8, dwell: 42, zone: 'Entrance' },
    { id: 'P-105', x: 280, y: 220, vx: -0.8, vy: 1.1, dwell: 115, zone: 'Aisle 2' },
    { id: 'P-108', x: 450, y: 180, vx: 0.5, vy: -0.4, dwell: 210, zone: 'Checkout Queue 1' },
    { id: 'P-112', x: 520, y: 260, vx: -1.0, vy: 0.2, dwell: 320, zone: 'Checkout Queue 1' },
    { id: 'P-115', x: 340, y: 310, vx: 0.9, vy: -0.7, dwell: 78, zone: 'Dairy Shelf' },
  ]);

  // Canvas render animation loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        // Update simulated positions
        targetsRef.current.forEach(t => {
          t.x += t.vx;
          t.y += t.vy;
          t.dwell += 0.1;

          // Bounce off boundaries
          if (t.x < 50 || t.x > canvas.width - 80) t.vx *= -1;
          if (t.y < 80 || t.y > canvas.height - 80) t.vy *= -1;
        });
      }

      // Draw Zone Polygons
      if (showZones) {
        // Queue Zone
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
        ctx.beginPath();
        ctx.rect(420, 120, 180, 200);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#F59E0B';
        ctx.font = '600 11px JetBrains Mono';
        ctx.fillText('ZONE: QUEUE 1 [CAP: 8]', 425, 138);

        // Shelf Zone
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
        ctx.fillStyle = 'rgba(0, 242, 254, 0.06)';
        ctx.beginPath();
        ctx.rect(260, 260, 140, 120);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#00F2FE';
        ctx.fillText('ZONE: DAIRY SHELF A1', 265, 278);
      }

      // Draw Trajectories & Persons
      targetsRef.current.forEach((t) => {
        // Bounding Box & Label
        if (showBoundingBoxes) {
          const w = 45;
          const h = 75;
          
          // Motion vector line
          if (showTrajectories) {
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(t.x + w/2, t.y + h/2);
            ctx.lineTo(t.x + w/2 + t.vx * 20, t.y + h/2 + t.vy * 20);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Box border
          ctx.strokeStyle = '#00F2FE';
          ctx.lineWidth = 2;
          ctx.strokeRect(t.x, t.y, w, h);

          // Top label tag
          ctx.fillStyle = '#00F2FE';
          ctx.fillRect(t.x, t.y - 18, w + 35, 18);
          
          ctx.fillStyle = '#000';
          ctx.font = 'bold 10px JetBrains Mono';
          ctx.fillText(`${t.id} 98%`, t.x + 4, t.y - 5);

          // Dwell timer below box
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(t.x, t.y + h + 2, w + 35, 16);
          ctx.fillStyle = '#10B981';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText(`⏱ ${Math.floor(t.dwell)}s`, t.x + 4, t.y + h + 14);
        }

        // Privacy Face Blur Mask simulation
        if (showPrivacyBlur) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(t.x + 22, t.y + 12, 12, 0, Math.PI * 2);
          ctx.clip();

          ctx.fillStyle = 'rgba(100, 116, 139, 0.85)';
          ctx.fillRect(t.x + 10, t.y, 24, 24);
          
          // Pixelated pattern grid
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(t.x + 12, t.y + 4, 6, 6);
          ctx.fillRect(t.x + 22, t.y + 12, 6, 6);
          ctx.restore();

          // Privacy badge
          ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
          ctx.font = 'bold 8px Inter';
          ctx.fillText('ANONYMOUS', t.x + 2, t.y + 24);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, showBoundingBoxes, showPrivacyBlur, showZones, showTrajectories]);

  const cameraNames = {
    'cam-1': 'Camera 01: Main Store Floor & Entrance',
    'cam-2': 'Camera 02: Checkout Counters & Billing',
    'cam-3': 'Camera 03: Dairy & Beverage Shelf',
    'cam-4': 'Camera 04: Produce & Organic Rack',
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="card-title">
        <div className="card-title-left">
          <Camera size={18} className="card-title-icon" />
          <span>Live Edge AI Stream · {cameraNames[activeCamera]}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            ● LIVE STREAM 1080p @ 30FPS
          </span>
        </div>
      </div>

      {/* Simulated CCTV Video Container */}
      <div className="video-feed-container">
        {/* Animated Radar Scanning Line */}
        <div className="radar-sweep"></div>

        {/* Background Store Graphics / CCTV simulation pattern */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.18 }}>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00F2FE" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>

        {/* Simulated Store Floor Graphic Elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4) 0%, rgba(8, 12, 20, 0.95) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          padding: '16px',
          pointerEvents: 'none'
        }}>
          {/* Top Info Bar Overlay */}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <div>CAM-ID: {activeCamera.toUpperCase()} | RTSP://EDGE-NODE-01.LOCAL/STREAM</div>
            <div>PRIVACY MODE: ENFORCED (NO FACE DISK WRITE)</div>
          </div>

          {/* Bottom Telemetry Overlay */}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <div>DETECTED SHOPPERS: <strong style={{ color: 'var(--accent-cyan)' }}>{shoppersCount}</strong></div>
            <div>QUEUE CONGESTION: <strong style={{ color: queueLength > 5 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>{queueLength} PERSONS</strong></div>
          </div>
        </div>

        {/* HTML5 Canvas overlay for real-time YOLO boxes */}
        <canvas
          ref={canvasRef}
          width={720}
          height={405}
          className="video-overlay-canvas"
        />
      </div>

      {/* Camera Controls & Overlay Toggle Controls */}
      <div className="camera-controls-bar" style={{ borderRadius: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Camera Selection Pills */}
          {['cam-1', 'cam-2', 'cam-3', 'cam-4'].map((camKey) => (
            <button
              key={camKey}
              className={`toggle-pill ${activeCamera === camKey ? 'active' : ''}`}
              onClick={() => setActiveCamera(camKey)}
            >
              <Camera size={13} />
              {camKey.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dynamic AI Toggles */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`toggle-pill ${showBoundingBoxes ? 'active' : ''}`}
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
          >
            <Layers size={13} />
            YOLO Boxes
          </button>

          <button
            className={`toggle-pill ${showPrivacyBlur ? 'active' : ''}`}
            onClick={() => setShowPrivacyBlur(!showPrivacyBlur)}
          >
            <Shield size={13} />
            Face Blur Privacy
          </button>

          <button
            className={`toggle-pill ${showZones ? 'active' : ''}`}
            onClick={() => setShowZones(!showZones)}
          >
            <Zap size={13} />
            Zones
          </button>

          <button
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'Pause Feed' : 'Resume Feed'}
          </button>
        </div>
      </div>
    </div>
  );
}
