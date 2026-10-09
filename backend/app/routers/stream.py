from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import cv2
import base64
import time
import os
import logging
from typing import Dict
from backend.app.services.vision_tracker import VisionTracker

logger = logging.getLogger("stream_router")

router = APIRouter(prefix="/api/stream", tags=["Stream"])

# Store camera tracker instances and video readers
camera_trackers: Dict[str, VisionTracker] = {}
camera_caps: Dict[str, cv2.VideoCapture] = {}
global_settings = {"face_blur_enabled": True}

def get_or_create_tracker(camera_id: str) -> VisionTracker:
    if camera_id not in camera_trackers:
        camera_trackers[camera_id] = VisionTracker(camera_id)
    return camera_trackers[camera_id]

def get_or_create_cap(camera_id: str) -> cv2.VideoCapture:
    video_path = os.path.join("data", "samples", "sample_store.mp4")
    if not os.path.exists(video_path):
        from backend.app.services.vision_tracker import DEFAULT_ZONES
    
    if camera_id not in camera_caps or not camera_caps[camera_id].isOpened():
        cap = cv2.VideoCapture(video_path)
        camera_caps[camera_id] = cap
    return camera_caps[camera_id]

def update_global_settings(settings: dict):
    global global_settings
    global_settings.update(settings)

def generate_mjpeg_stream(camera_id: str):
    tracker = get_or_create_tracker(camera_id)
    cap = get_or_create_cap(camera_id)
    
    while True:
        ret, frame = cap.read()
        if not ret:
            # Loop sample video smoothly
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
            if not ret:
                time.sleep(0.1)
                continue

        blur_enabled = global_settings.get("face_blur_enabled", True)
        processed_frame, _ = tracker.process_frame(frame, face_blur=blur_enabled)

        # Encode frame to JPEG
        _, jpeg = cv2.imencode('.jpg', processed_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        frame_bytes = jpeg.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.04) # ~25 fps

@router.get("/feed/{camera_id}")
def video_feed(camera_id: str):
    """
    MJPEG video stream endpoint for HTML <img> tag or video canvas.
    """
    return StreamingResponse(
        generate_mjpeg_stream(camera_id),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.get("/frame/{camera_id}")
def get_single_frame(camera_id: str):
    """
    JSON endpoint returning Base64 encoded frame + exact metadata payload for custom canvas drawing.
    """
    tracker = get_or_create_tracker(camera_id)
    cap = get_or_create_cap(camera_id)
    
    ret, frame = cap.read()
    if not ret:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        ret, frame = cap.read()

    if not ret or frame is None:
        raise HTTPException(status_code=500, detail="Unable to capture frame from video source")

    blur_enabled = global_settings.get("face_blur_enabled", True)
    processed_frame, metadata = tracker.process_frame(frame, face_blur=blur_enabled)

    _, jpeg = cv2.imencode('.jpg', processed_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
    b64_img = base64.b64encode(jpeg.tobytes()).decode('utf-8')

    return {
        "image_base64": f"data:image/jpeg;base64,{b64_img}",
        "metadata": metadata
    }
