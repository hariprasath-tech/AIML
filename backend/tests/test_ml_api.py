"""
Smoke and Integration Tests for Retail Intelligence Platform
Tests:
  - Synthetic data integrity (10,000 rows, required columns)
  - Trained ML models existence & inference output
  - FastAPI endpoints (/api/metrics, /api/forecast/queue, /api/shelves, /api/model-metrics)
  - WebSocket connection & streaming response
"""

import json
import os
import pytest
from fastapi.testclient import TestClient
import pandas as pd
import joblib
from backend.main import app

client = TestClient(app)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")


def test_synthetic_data_integrity():
    queue_file = os.path.join(DATA_DIR, "queue_data.csv")
    footfall_file = os.path.join(DATA_DIR, "footfall_data.csv")
    shelf_file = os.path.join(DATA_DIR, "shelf_data.csv")

    assert os.path.exists(queue_file), "queue_data.csv must exist"
    assert os.path.exists(footfall_file), "footfall_data.csv must exist"
    assert os.path.exists(shelf_file), "shelf_data.csv must exist"

    df_queue = pd.read_csv(queue_file)
    df_footfall = pd.read_csv(footfall_file)
    df_shelf = pd.read_csv(shelf_file)

    assert len(df_queue) == 10000, "queue_data.csv must contain exactly 10,000 rows"
    assert len(df_footfall) == 10000, "footfall_data.csv must contain exactly 10,000 rows"
    assert len(df_shelf) == 10000, "shelf_data.csv must contain exactly 10,000 rows"

    # Check key columns
    assert "wait_time_min" in df_queue.columns
    assert "entries" in df_footfall.columns
    assert "status" in df_shelf.columns


def test_trained_models_exist_and_infer():
    q_reg = os.path.join(MODELS_DIR, "queue_wait_regressor.joblib")
    q_clf = os.path.join(MODELS_DIR, "queue_congestion_classifier.joblib")
    s_clf = os.path.join(MODELS_DIR, "shelf_status_classifier.joblib")
    f_reg = os.path.join(MODELS_DIR, "footfall_forecaster.joblib")
    metrics_path = os.path.join(MODELS_DIR, "metrics.json")

    assert os.path.exists(q_reg)
    assert os.path.exists(q_clf)
    assert os.path.exists(s_clf)
    assert os.path.exists(f_reg)
    assert os.path.exists(metrics_path)

    # Test Queue Regressor Inference
    model_reg = joblib.load(q_reg)
    q_input = pd.DataFrame([{
        "queue_length": 5,
        "active_counters": 3,
        "hour": 12,
        "day_of_week": 1,
        "is_weekend": 0,
        "is_festival": 0,
        "avg_service_time": 1.2,
        "counter_id": "Counter_1"
    }])
    wait_pred = model_reg.predict(q_input)
    assert len(wait_pred) == 1
    assert wait_pred[0] > 0

    # Test Shelf Classifier Inference
    model_shelf = joblib.load(s_clf)
    shelf_input = pd.DataFrame([{
        "fill_percent": 15.0,
        "sales_rate": 4.5,
        "hours_since_restock": 20.0,
        "category": "Dairy",
        "shelf_id": "S1"
    }])
    status_pred = model_shelf.predict(shelf_input)
    assert status_pred[0] in ["FULL", "LOW", "OUT"]


def test_api_metrics():
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "activeShoppers" in data
    assert "avgQueueWaitMins" in data
    assert "stockOutsCount" in data


def test_api_forecast_queue():
    response = client.get("/api/forecast/queue")
    assert response.status_code == 200
    data = response.json()
    assert "counters" in data
    assert "waitTimeTrend" in data
    assert len(data["counters"]) > 0


def test_api_shelves():
    response = client.get("/api/shelves")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "status" in data[0]


def test_api_model_metrics():
    response = client.get("/api/model-metrics")
    assert response.status_code == 200
    data = response.json()
    assert "queue_wait_regression" in data
    assert "shelf_status_classification" in data
    assert "test_mae" in data["queue_wait_regression"]
    assert "test_macro_f1" in data["shelf_status_classification"]


def test_websocket_stream():
    with client.websocket_connect("/ws") as websocket:
        data = websocket.receive_text()
        payload = json.loads(data)
        assert payload["type"] == "live_stream_update"
        assert "kpiMetrics" in payload
        assert "counters" in payload
        assert "shelves" in payload
        assert "modelMetrics" in payload
