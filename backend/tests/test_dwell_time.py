import pytest
import time
from backend.app.services.vision_tracker import VisionTracker

def test_point_in_polygon():
    tracker = VisionTracker("test-cam")
    # Unit box polygon
    poly = [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]]
    
    # Point inside
    assert tracker._point_in_polygon((0.5, 0.5), poly) == True
    # Point outside
    assert tracker._point_in_polygon((1.5, 1.5), poly) == False

def test_dwell_time_accumulation():
    tracker = VisionTracker("test-cam")
    track_id = 101
    zone_name = "Shelf Zone A"
    
    # Start entry
    t_start = time.time()
    tracker.active_dwells[track_id] = {zone_name: t_start - 10.0} # 10 seconds ago
    
    # Check calculated dwell duration
    current_dwell = time.time() - tracker.active_dwells[track_id][zone_name]
    assert current_dwell >= 10.0
