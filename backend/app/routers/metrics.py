from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter(prefix="/api/metrics", tags=["Metrics"])

METRICS_FILE = os.path.join("data", "metrics", "model_metrics.json")

@router.get("/model")
def get_model_metrics():
    if not os.path.exists(METRICS_FILE):
        raise HTTPException(status_code=404, detail="Model metrics JSON file not found")
    
    try:
        with open(METRICS_FILE, "r") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read model metrics file: {str(e)}")
