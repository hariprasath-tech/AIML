from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="admin")
    created_at = Column(DateTime, default=datetime.utcnow)

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String, primary_key=True, index=True) # e.g. "cam-1", "cam-2"
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    stream_source = Column(String, default="data/samples/sample_store.mp4")
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ZoneConfig(Base):
    __tablename__ = "zone_configs"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String, ForeignKey("cameras.id"), nullable=False)
    zone_name = Column(String, nullable=False) # "Queue Zone", "Shelf Zone A", "Shelf Zone B", "Main Aisle"
    zone_type = Column(String, nullable=False) # "queue", "shelf", "aisle"
    polygon_json = Column(Text, nullable=False) # JSON array of [x, y] normalized coordinates
    capacity_threshold = Column(Integer, default=3)
    dwell_threshold_seconds = Column(Integer, default=60)
    created_at = Column(DateTime, default=datetime.utcnow)

class DwellLog(Base):
    __tablename__ = "dwell_logs"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String, nullable=False)
    zone_name = Column(String, nullable=False)
    track_id = Column(Integer, nullable=False)
    entry_time = Column(DateTime, nullable=False)
    exit_time = Column(DateTime, nullable=False)
    dwell_seconds = Column(Float, nullable=False)

class QueueLog(Base):
    __tablename__ = "queue_logs"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String, nullable=False)
    queue_length = Column(Integer, nullable=False)
    estimated_wait_seconds = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class InventoryLog(Base):
    __tablename__ = "inventory_logs"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String, nullable=False)
    shelf_name = Column(String, nullable=False)
    fill_level_pct = Column(Float, nullable=False)
    status = Column(String, default="Normal") # "Normal", "Low Stock"
    timestamp = Column(DateTime, default=datetime.utcnow)

class AlertLog(Base):
    __tablename__ = "alert_logs"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String, nullable=False)
    alert_type = Column(String, nullable=False) # "Queue Capacity Exceeded", "Low Stock Alert", "High Dwell Time"
    message = Column(String, nullable=False)
    severity = Column(String, default="warning") # "info", "warning", "critical"
    timestamp = Column(DateTime, default=datetime.utcnow)
    resolved = Column(Boolean, default=False)

class SystemSettings(Base):
    __tablename__ = "system_settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(String, nullable=False)
