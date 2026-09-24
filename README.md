# 🛒 AI-Powered Retail Intelligence Platform
### Shopper Analytics · Inventory Visibility · Queue Management

> Smart India Hackathon 2026 – AI/ML Problem Statement
> **Problem Statement ID:** `<26179 – verify on SIH portal>`  |  **Organization:** `<Qualcomm – verify>`  |  **Category:** `<Hardware – verify>`
> **Team Name:** `<your team name>`  |  **College:** `<your college>`

---

## 📌 Problem Statement

Retail stores in India, from neighbourhood shops and pharmacies to large supermarkets, deal with:

- Stock-outs and poor shelf/inventory visibility
- Long billing queues and unpredictable wait times
- No insight into shopper behaviour (footfall, movement, dwell time)
- Limited operational analytics, and often poor internet connectivity

## 💡 Our Solution

A **privacy-first, edge-friendly retail intelligence platform** that turns ordinary store camera feeds into live operational insights. Video is processed **locally**. Only anonymous metrics (counts, timers, states) are stored. No faces are captured or saved.

### Key Features

| Module | What it does |
|---|---|
| **Shopper Analytics** | Person detection & tracking, entry/exit footfall, per-zone dwell time, movement heatmap |
| **Inventory Visibility** | Shelf status detection (FULL / LOW / OUT) with stock-out alerts |
| **Queue Management** | Queue length, per-person wait time, congestion alerts, short-term congestion forecast |
| **Live Dashboard** | Real-time KPIs, charts, heatmap and alert feed |
| **Alerts** | Severity-based alerts (INFO / WARNING / HIGH) for long queues, empty shelves, camera offline |
| **Privacy by design** | Anonymous tracking IDs, no face storage, uploaded video deleted after processing |

## 🏗️ Architecture

```
 ┌──────────────┐    ┌───────────────────────┐    ┌───────────────┐    ┌──────────────────┐
 │ Video / CCTV │ ─▶ │ AI Engine (Python)    │ ─▶ │ FastAPI       │ ─▶ │ Web Dashboard    │
 │ (file / RTSP)│    │ YOLO + Tracker        │    │ REST + WS     │    │ KPIs, heatmap,   │
 │              │    │ zones · queue · shelf │    │ + SQLite      │    │ alerts           │
 └──────────────┘    └───────────────────────┘    └───────────────┘    └──────────────────┘
```

## 🧰 Tech Stack

| Layer | Tools |
|---|---|
| Detection & Tracking | Ultralytics YOLO, ByteTrack, OpenCV, `supervision` |
| Backend | Python, FastAPI, WebSockets, SQLite |
| Dashboard | React, Vite, Recharts, Lucide Icons, Vanilla CSS |
| Edge Deployment | ONNX export, CPU benchmarking |
| Dev Tools | Git, GitHub, VS Code |

## 📁 Project Structure

```
.
├── src/
│   ├── components/        # UI components (LiveFeed, Heatmap, QueueMonitor, ShelfStatus, Analytics)
│   ├── context/           # App state & simulated real-time stream
│   ├── styles/            # CSS Design System (Glassmorphism, animations, theme tokens)
│   ├── App.jsx            # Main dashboard layout
│   └── main.jsx
├── ai_engine/             # Python vision engine scripts (YOLO, Tracker, Analytics)
├── backend/               # FastAPI backend & WebSocket server
├── index.html
└── README.md
```

## ⚙️ Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

- Web Dashboard: http://localhost:5173
