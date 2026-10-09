from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.schemas import SettingsSchema, ZoneConfigSchema
from backend.app import models

router = APIRouter(prefix="/api/settings", tags=["Settings"])

# Global settings in memory
current_settings = {
    "face_blur_enabled": True,
    "queue_capacity_threshold": 3,
    "avg_service_time_seconds": 45,
    "low_stock_threshold_pct": 30.0
}

# Listener callback to update stream router when settings change
settings_change_listener = None

def register_settings_listener(fn):
    global settings_change_listener
    settings_change_listener = fn

@router.get("/")
def get_settings():
    return current_settings

@router.post("/")
def update_settings(new_settings: SettingsSchema):
    global current_settings
    current_settings["face_blur_enabled"] = new_settings.face_blur_enabled
    current_settings["queue_capacity_threshold"] = new_settings.queue_capacity_threshold
    current_settings["avg_service_time_seconds"] = new_settings.avg_service_time_seconds
    current_settings["low_stock_threshold_pct"] = new_settings.low_stock_threshold_pct

    if settings_change_listener:
        settings_change_listener(current_settings)

    return {"message": "Settings updated successfully", "settings": current_settings}

@router.get("/zones")
def get_zone_configs():
    return [
        {
            "id": 1,
            "camera_id": "cam-1",
            "zone_name": "Queue Zone",
            "zone_type": "queue",
            "polygon": [[0.55, 0.55], [0.95, 0.55], [0.95, 0.92], [0.55, 0.92]],
            "capacity_threshold": current_settings["queue_capacity_threshold"],
            "dwell_threshold_seconds": 120
        },
        {
            "id": 2,
            "camera_id": "cam-1",
            "zone_name": "Shelf Zone A",
            "zone_type": "shelf",
            "polygon": [[0.05, 0.10], [0.45, 0.10], [0.45, 0.45], [0.05, 0.45]],
            "capacity_threshold": 5,
            "dwell_threshold_seconds": 60
        },
        {
            "id": 3,
            "camera_id": "cam-1",
            "zone_name": "Shelf Zone B",
            "zone_type": "shelf",
            "polygon": [[0.50, 0.10], [0.92, 0.10], [0.92, 0.35], [0.50, 0.35]],
            "capacity_threshold": 5,
            "dwell_threshold_seconds": 60
        },
        {
            "id": 4,
            "camera_id": "cam-1",
            "zone_name": "Main Aisle",
            "zone_type": "aisle",
            "polygon": [[0.05, 0.50], [0.45, 0.50], [0.45, 0.90], [0.05, 0.90]],
            "capacity_threshold": 10,
            "dwell_threshold_seconds": 30
        }
    ]
