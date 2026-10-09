from sqlalchemy.orm import Session
from backend.app import models
from datetime import datetime

def evaluate_shelf_status(db: Session, camera_id: str, shelf_name: str, fill_level_pct: float, threshold_pct: float = 30.0):
    status = "Normal" if fill_level_pct >= threshold_pct else "Low Stock"
    
    # Save log entry
    log_entry = models.InventoryLog(
        camera_id=camera_id,
        shelf_name=shelf_name,
        fill_level_pct=round(fill_level_pct, 1),
        status=status,
        timestamp=datetime.utcnow()
    )
    db.add(log_entry)
    
    # Check if alert needs to be raised
    if status == "Low Stock":
        # Check if unresolved alert already exists to prevent duplicate flooding
        existing = db.query(models.AlertLog).filter(
            models.AlertLog.camera_id == camera_id,
            models.AlertLog.alert_type == "Low Stock Alert",
            models.AlertLog.message.contains(shelf_name),
            models.AlertLog.resolved == False
        ).first()

        if not existing:
            alert = models.AlertLog(
                camera_id=camera_id,
                alert_type="Low Stock Alert",
                message=f"Low Stock Alert: {shelf_name} fill level dropped to {round(fill_level_pct, 1)}%",
                severity="warning",
                timestamp=datetime.utcnow(),
                resolved=False
            )
            db.add(alert)
    
    db.commit()
    return status
