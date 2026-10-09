import React, { useState, useEffect, useRef } from 'react';
import { API_BASE, useApp } from '../context/AppContext';
import ErrorBanner from './ErrorBanner';

export default function VideoCanvas({ cameraId = 'cam-1', showZones = true, height = '450px' }) {
  const { faceBlurEnabled } = useApp();
  const [frameData, setFrameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch frame + detection metadata payload continuously
  useEffect(() => {
    let isMounted = true;
    let timerId = null;

    const fetchFrame = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stream/frame/${cameraId}`);
        if (!res.ok) {
          throw new Error(`Feed error HTTP ${res.status}`);
        }
        const data = await res.json();
        if (isMounted) {
          setFrameData(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
      if (isMounted) {
        timerId = setTimeout(fetchFrame, 150); // ~7 fps polling for frame metadata sync
      }
    };

    fetchFrame();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [cameraId, faceBlurEnabled]);

  // Draw overlay annotations on canvas whenever frameData changes
  useEffect(() => {
    if (!frameData || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    const img = new Image();
    img.src = frameData.image_base64;
    img.onload = () => {
      // Set canvas size matching container dimensions cleanly
      const cw = container.clientWidth || 800;
      const ch = container.clientHeight || 450;
      canvas.width = cw;
      canvas.height = ch;

      const scaleX = cw / (img.naturalWidth || 800);
      const scaleY = ch / (img.naturalHeight || 600);

      // 1. Draw base video frame image
      ctx.drawImage(img, 0, 0, cw, ch);

      const metadata = frameData.metadata || {};
      const detections = metadata.detections || [];

      // 2. Draw Zone Polygons if enabled (Layer 1)
      if (showZones) {
        const zones = [
          { name: "Queue Zone", type: "queue", poly: [[0.55, 0.55], [0.95, 0.55], [0.95, 0.92], [0.55, 0.92]], color: "rgba(234, 179, 8, 0.15)", stroke: "#ca8a04" },
          { name: "Shelf Zone A", type: "shelf", poly: [[0.05, 0.10], [0.45, 0.10], [0.45, 0.45], [0.05, 0.45]], color: "rgba(59, 130, 246, 0.15)", stroke: "#2563eb" },
          { name: "Shelf Zone B", type: "shelf", poly: [[0.50, 0.10], [0.92, 0.10], [0.92, 0.35], [0.50, 0.35]], color: "rgba(16, 185, 129, 0.15)", stroke: "#059669" },
          { name: "Main Aisle", type: "aisle", poly: [[0.05, 0.50], [0.45, 0.50], [0.45, 0.90], [0.05, 0.90]], color: "rgba(100, 116, 139, 0.12)", stroke: "#64748b" }
        ];

        zones.forEach(z => {
          ctx.beginPath();
          z.poly.forEach((pt, idx) => {
            const px = pt[0] * cw;
            const py = pt[1] * ch;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.fillStyle = z.color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = z.stroke;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw Zone Label cleanly at top left of zone
          const labelX = z.poly[0][0] * cw + 6;
          const labelY = z.poly[0][1] * ch + 16;
          ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
          ctx.fillRect(labelX - 4, labelY - 12, ctx.measureText(z.name).width + 12, 16);
          ctx.font = "11px Inter, sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(z.name, labelX, labelY);
        });
      }

      // 3. Draw Clamped Person Bounding Boxes & Tracking Labels (Layer 2)
      detections.forEach(det => {
        const box = det.box; // [x1, y1, x2, y2]
        
        // Scale and clamp coordinates strictly within canvas bounds
        const x1 = Math.max(0, Math.min(box[0] * scaleX, cw - 4));
        const y1 = Math.max(0, Math.min(box[1] * scaleY, ch - 4));
        const x2 = Math.max(x1 + 10, Math.min(box[2] * scaleX, cw - 2));
        const y2 = Math.max(y1 + 10, Math.min(box[3] * scaleY, ch - 2));

        const bw = x2 - x1;
        const bh = y2 - y1;

        const isQueue = det.current_zone === "Queue Zone";
        const boxColor = isQueue ? "#eab308" : "#2563eb";

        // Bounding Box Rectangle
        ctx.lineWidth = 2;
        ctx.strokeStyle = boxColor;
        ctx.strokeRect(x1, y1, bw, bh);

        // Header Label Tag (ID + Real Conf + Dwell Time)
        const tid = det.track_id;
        const conf = Math.round(det.conf * 100);
        const zoneText = det.current_zone ? ` | ${det.current_zone}` : '';
        const dwellText = det.dwell_seconds ? ` (${det.dwell_seconds}s)` : '';
        const labelStr = `P-${tid} [${conf}%]${zoneText}${dwellText}`;

        ctx.font = "11px Inter, sans-serif";
        const textWidth = ctx.measureText(labelStr).width;
        
        // Clamp label Y position so label NEVER gets cut off at top of canvas
        const labelY = y1 > 22 ? y1 - 22 : y1 + bh + 4;
        const labelX = Math.max(2, Math.min(x1, cw - textWidth - 10));

        // Background tag pill
        ctx.fillStyle = boxColor;
        ctx.fillRect(labelX, labelY, textWidth + 10, 18);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(labelStr, labelX + 5, labelY + 13);
      });
    };
  }, [frameData, showZones]);

  return (
    <div className="relative w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-200" style={{ height }}>
      {error && (
        <div className="absolute inset-0 z-20 bg-slate-900/90 p-4 flex flex-col items-center justify-center">
          <ErrorBanner
            title="Camera Stream Disconnected"
            message={`Unable to connect to camera feed (${cameraId}). Backend server may be offline.`}
            onRetry={() => setError(null)}
          />
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col items-center justify-center text-slate-300">
          <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-2" />
          <p className="text-xs font-mono">Initializing Camera {cameraId} Feed...</p>
        </div>
      )}

      {/* Video Overlay Canvas */}
      <div ref={containerRef} className="w-full h-full relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Frame Status Overlay */}
      {frameData && (
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 text-[11px] font-mono text-white/90 bg-slate-950/75 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Cam: {cameraId}</span>
          <span>|</span>
          <span>Shoppers: {frameData.metadata?.shoppers_in_frame || 0}</span>
          <span>|</span>
          <span>Queue: {frameData.metadata?.queue_length || 0}</span>
        </div>
      )}
    </div>
  );
}
