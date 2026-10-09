import cv2
import numpy as np

def apply_face_blur(frame: np.ndarray, boxes: list) -> np.ndarray:
    """
    Applies Gaussian Blur strictly to the head region (top 25% of person bounding box).
    Clamps ROI coordinates to prevent frame boundary errors.
    No face images are saved or stored.
    """
    if frame is None or len(boxes) == 0:
        return frame

    h, w = frame.shape[:2]
    processed_frame = frame.copy()

    for box in boxes:
        # box format: [x1, y1, x2, y2]
        x1, y1, x2, y2 = [int(v) for v in box[:4]]

        # Clamp bounding box coordinates to canvas dimensions
        x1 = max(0, min(x1, w - 1))
        y1 = max(0, min(y1, h - 1))
        x2 = max(0, min(x2, w - 1))
        y2 = max(0, min(y2, h - 1))

        box_h = y2 - y1
        box_w = x2 - x1

        if box_h > 10 and box_w > 10:
            # Head region estimation: top 25% of the person's bounding box
            head_y1 = y1
            head_y2 = min(h, y1 + int(box_h * 0.25))
            head_x1 = x1
            head_x2 = x2

            head_roi = processed_frame[head_y1:head_y2, head_x1:head_x2]
            if head_roi.size > 0:
                # Use strong Gaussian Blur
                blurred_head = cv2.GaussianBlur(head_roi, (31, 31), 25)
                processed_frame[head_y1:head_y2, head_x1:head_x2] = blurred_head

    return processed_frame
