from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models

router = APIRouter(prefix="/api/queue", tags=["Queue"])

@router.get("/status")
def get_queue_status(db: Session = Depends(get_db)):
    # Calculate queue length and wait time from active camera trackers or DB
    recent = db.query(models.QueueLog).order_by(models.QueueLog.id.desc()).first()
    
    queue_length = recent.queue_length if recent else 3
    avg_service_time = 45 # seconds
    estimated_wait = queue_length * avg_service_time

    return {
        "camera_id": "cam-1",
        "queue_length": queue_length,
        "capacity_threshold": 3,
        "avg_service_time_seconds": avg_service_time,
        "estimated_wait_seconds": estimated_wait,
        "status": "High Queue Alert" if queue_length > 3 else "Normal",
        "active_queue_shoppers": [
            {"track_id": "P-101", "wait_time_sec": 85.0, "position": 1},
            {"track_id": "P-102", "wait_time_sec": 42.5, "position": 2},
            {"track_id": "P-105", "wait_time_sec": 12.0, "position": 3}
        ]
    }

@router.get("/history")
def get_queue_history(db: Session = Depends(get_db)):
    # Return time-series data for wait time chart
    history = [
        {"time": "10:00", "queue_length": 1, "wait_minutes": 0.75},
        {"time": "10:15", "queue_length": 2, "wait_minutes": 1.5},
        {"time": "10:30", "queue_length": 4, "wait_minutes": 3.0},
        {"time": "10:45", "queue_length": 3, "wait_minutes": 2.25},
        {"time": "11:00", "queue_length": 2, "wait_minutes": 1.5},
        {"time": "11:15", "queue_length": 5, "wait_minutes": 3.75},
        {"time": "11:30", "queue_length": 3, "wait_minutes": 2.25}
    ]
    return history
