from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models
from datetime import datetime

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])

@router.get("/status")
def get_inventory_status(db: Session = Depends(get_db)):
    shelves = [
        {
            "shelf_id": "shelf-a",
            "name": "Shelf Zone A (Beverages)",
            "camera_id": "cam-1",
            "fill_level_pct": 28.5, # below 30% threshold -> Low Stock
            "threshold_pct": 30.0,
            "status": "Low Stock",
            "total_bays": 8,
            "empty_bays": 5,
            "last_updated": datetime.utcnow().isoformat()
        },
        {
            "shelf_id": "shelf-b",
            "name": "Shelf Zone B (Packaged Goods)",
            "camera_id": "cam-1",
            "fill_level_pct": 74.2,
            "threshold_pct": 30.0,
            "status": "Normal",
            "total_bays": 10,
            "empty_bays": 2,
            "last_updated": datetime.utcnow().isoformat()
        },
        {
            "shelf_id": "shelf-c",
            "name": "Shelf Zone C (Snacks)",
            "camera_id": "cam-2",
            "fill_level_pct": 85.0,
            "threshold_pct": 30.0,
            "status": "Normal",
            "total_bays": 6,
            "empty_bays": 1,
            "last_updated": datetime.utcnow().isoformat()
        }
    ]
    return shelves

@router.post("/reorder/{shelf_id}")
def trigger_reorder(shelf_id: str, db: Session = Depends(get_db)):
    # Simulates dispatching stock reorder request
    alert = models.AlertLog(
        camera_id="cam-1",
        alert_type="Stock Reorder Dispatched",
        message=f"Automated restock order created for {shelf_id.upper()}",
        severity="info",
        timestamp=datetime.utcnow(),
        resolved=True
    )
    db.add(alert)
    db.commit()
    return {"message": f"Stock reorder successfully dispatched for {shelf_id}", "status": "success"}
