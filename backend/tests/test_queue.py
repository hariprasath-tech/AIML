import pytest

def test_queue_wait_time_formula():
    queue_length = 4
    avg_service_time = 45 # seconds
    
    expected_wait = queue_length * avg_service_time
    assert expected_wait == 180 # 3 minutes

def test_queue_alert_triggering():
    queue_length = 5
    capacity_threshold = 3
    
    should_alert = queue_length > capacity_threshold
    assert should_alert == True
