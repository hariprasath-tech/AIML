# 🛒 AI-Powered Retail Intelligence Platform
### Shopper Analytics · Inventory Visibility · Queue Management

> Smart India Hackathon 2026 – AI/ML Problem Statement
> **Problem Statement ID:** `<26179 – verify on SIH portal>`  |  **Organization:** `<Qualcomm – verify>`  |  **Category:** `<Hardware – verify>`

---

## 📌 Problem Statement

Retail stores in India, from neighbourhood shops and pharmacies to large supermarkets, deal with:

- Stock-outs and poor shelf/inventory visibility
- Long billing queues and unpredictable wait times
- No insight into shopper behaviour (footfall, movement, dwell time)
- Limited operational analytics, and often poor internet connectivity

## 💡 Our Solution

A **privacy-first, edge-friendly retail intelligence platform** that turns ordinary store camera feeds and retail telemetry into live operational insights. Video is processed locally with anonymous tracking IDs, while machine learning models forecast billing queue congestion, monitor shelf stock levels, and predict footfall trends.

### Key Features

| Module | What it does |
|---|---|
| **Shopper Analytics** | Person tracking, entry/exit footfall, per-zone dwell time, movement heatmap |
| **Inventory Visibility** | Shelf status detection (FULL / LOW / OUT) with stock-out alerts (LightGBM Classifier) |
| **Queue Management** | Wait-time prediction (LightGBM Regressor) & 3-class congestion forecasting (Normal / Busy / Congested) |
| **Footfall Forecasting** | Next-hour store zone entries forecast (LightGBM Regressor) |
| **Live Dashboard** | Real-time KPIs, charts, heatmap, and alert feed streaming over WebSockets (every 2 seconds) |
| **Privacy by design** | Anonymous tracking IDs, no face storage, edge-friendly |

---

## 🏗️ Architecture

```
 ┌──────────────┐     ┌────────────────────────┐     ┌─────────────────┐     ┌──────────────────┐
 │ Synthetic    │ ──▶ │ AI Engine (Python)     │ ──▶ │ FastAPI Backend │ ──▶ │ React + Vite UI  │
 │ Data Layer   │     │ LightGBM / Scikit-Learn│     │ REST + WS (/ws) │     │ Live Dashboard   │
 │ (10k rows)   │     │ 70/15/15 Time Split    │     │ Port 8000       │     │ Port 5173        │
 └──────────────┘     └────────────────────────┘     └─────────────────┘     └──────────────────┘
```

---

## 🚀 Quickstart & Exact Run Commands

### 1. Generate Synthetic Data
Generates 10,000 rows each for queue, footfall, and shelf datasets with Poisson arrivals, peak hours (11-13, 17-20), and 2% sensor dropouts:
```bash
python scripts/generate_synthetic.py
```

### 2. Train Machine Learning Models
Trains the queue wait-time regressor, congestion classifier, shelf status classifier, and footfall forecaster using a chronological 70/15/15 train/val/test split (no random shuffle):
```bash
python ai_engine/train.py
```

### 3. Start Backend Server (FastAPI + WebSocket)
Starts the FastAPI server with CORS enabled for `http://localhost:5173` and real-time WebSocket inference at `ws://localhost:8000/ws`:
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Start Front End Dashboard (React + Vite)
Starts the interactive operations dashboard:
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### 5. Run Test Suite
```bash
python -m pytest backend/tests/
```

---

## 📊 Model Evaluation Results (Test Split)

All models are evaluated on a strict 15% out-of-time test split against baseline models (Moving Average / Majority Class). Artifacts are saved to `models/` and metrics to `models/metrics.json`.

| Model Task | Algorithm | Metric | Model Score | Baseline Score | Improvement |
|---|---|---|---|---|---|
| **Queue Wait-Time** | LightGBM Regressor | MAE / RMSE | **0.316m** / 0.833m | 3.396m / 4.575m | **90.7% lower MAE** |
| **Queue Congestion** | LightGBM Classifier | Macro-F1 / Acc | **0.957** / 96.1% | 0.207 / 45.0% | **+0.750 Macro-F1** |
| **Shelf Stock Status** | LightGBM Classifier | Macro-F1 / Acc | **0.990** / 99.3% | 0.256 / 62.3% | **+0.734 Macro-F1** |
| **Footfall Next-Hour** | LightGBM Regressor | MAE / RMSE | **3.192** / 4.523 | 7.487 / 11.544 | **57.4% lower MAE** |

---

## ⚠️ Synthetic Data Disclaimer & Real-World Validation

> **IMPORTANT NOTICE:**  
> The datasets utilized for model training and benchmarking (`data/queue_data.csv`, `data/footfall_data.csv`, `data/shelf_data.csv`) are synthetically generated to model retail queueing dynamics (Poisson arrivals, Little's Law wait times, peak hours 11:00–13:00 and 17:00–20:00, festival/weekend boosts, and 2% sensor dropouts).
>
> While this synthetic generation provides a controlled and reproducible testing framework, **real-world store environments introduce complex non-linearities** (camera occlusion, variable checkout basket sizes, lighting shifts, and customer re-routing). Prior to commercial retail rollout, these models must be validated and calibrated on real CCTV camera feeds and point-of-sale (POS) transaction logs.

---

## 📡 REST API & WebSocket Endpoints

- `GET /api/metrics` — Current store KPIs (active shoppers, dwell time, queue wait, stockouts)
- `GET /api/forecast/queue` — Checkout counter statuses and 15-minute wait-time forecasts
- `GET /api/shelves` — Shelf fill levels, SKU details, and AI status detections (FULL / LOW / OUT)
- `GET /api/model-metrics` — Machine learning test split evaluation scores and confusion matrices
- `WebSocket /ws` — Live stream broadcasting new telemetry & model inferences every 2 seconds
