from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    full_name: Optional[str]
    role: str

class ZoneConfigSchema(BaseModel):
    id: Optional[int] = None
    camera_id: str
    zone_name: str
    zone_type: str
    polygon: List[List[float]]
    capacity_threshold: int = 3
    dwell_threshold_seconds: int = 60

class SettingsSchema(BaseModel):
    face_blur_enabled: bool = True
    queue_capacity_threshold: int = 3
    avg_service_time_seconds: int = 45
    low_stock_threshold_pct: float = 30.0

class AlertResponse(BaseModel):
    id: int
    camera_id: str
    alert_type: str
    message: str
    severity: str
    timestamp: str
    resolved: bool

class KPISummary(BaseModel):
    shoppers_in_store: int
    total_unique_visitors: int
    avg_dwell_seconds: float
    active_queue_length: int
    estimated_wait_seconds: float
    low_stock_shelves_count: int
    active_alerts_count: int
    face_blur_status: str
