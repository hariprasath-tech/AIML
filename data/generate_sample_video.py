import cv2
import numpy as np
import os
import math

def create_sample_video():
    os.makedirs("data/samples", exist_ok=True)
    video_path = "data/samples/sample_store.mp4"
    
    width, height = 800, 600
    fps = 20
    duration_sec = 15
    total_frames = fps * duration_sec
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path, fourcc, fps, (width, height))
    
    # Define 3 simulated shoppers moving around
    shoppers = [
        # (id, start_x, start_y, target_x, target_y, speed)
        {"id": 101, "x": 100, "y": 500, "path": [(100, 500), (200, 350), (600, 450), (620, 470), (610, 460), (300, 520)], "speed": 2.5, "color": (180, 100, 50)},
        {"id": 102, "x": 700, "y": 550, "path": [(700, 550), (650, 420), (630, 440), (640, 450), (200, 200), (100, 200)], "speed": 2.0, "color": (50, 150, 200)},
        {"id": 103, "x": 150, "y": 150, "path": [(150, 150), (300, 200), (250, 250), (600, 480), (650, 500), (700, 520)], "speed": 1.8, "color": (100, 180, 80)},
        {"id": 104, "x": 50, "y": 450, "path": [(50, 450), (180, 480), (220, 220), (320, 220), (630, 430), (630, 440)], "speed": 2.2, "color": (200, 80, 150)}
    ]

    for frame_idx in range(total_frames):
        # Background floor
        frame = np.ones((height, width, 3), dtype=np.uint8) * 245
        
        # Grid lines (tiled floor)
        for x in range(0, width, 50):
            cv2.line(frame, (x, 0), (x, height), (230, 230, 230), 1)
        for y in range(0, height, 50):
            cv2.line(frame, (0, y), (width, y), (230, 230, 230), 1)

        # Draw Zones on floor subtly
        # Shelf Zone A
        cv2.rectangle(frame, (40, 60), (360, 270), (235, 240, 250), -1)
        cv2.rectangle(frame, (40, 60), (360, 270), (180, 190, 220), 2)
        cv2.putText(frame, "SHELF ZONE A", (50, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100, 110, 140), 1)

        # Shelf Zone B
        cv2.rectangle(frame, (400, 60), (740, 210), (235, 250, 240), -1)
        cv2.rectangle(frame, (400, 60), (740, 210), (170, 210, 190), 2)
        cv2.putText(frame, "SHELF ZONE B", (410, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (90, 140, 110), 1)

        # Queue Zone
        cv2.rectangle(frame, (440, 360), (760, 540), (250, 240, 230), -1)
        cv2.rectangle(frame, (440, 360), (760, 540), (220, 180, 150), 2)
        cv2.putText(frame, "CHECKOUT QUEUE ZONE", (450, 385), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (140, 100, 70), 1)

        # Main Aisle
        cv2.rectangle(frame, (40, 300), (360, 540), (240, 245, 245), -1)
        cv2.rectangle(frame, (40, 300), (360, 540), (200, 210, 210), 1)
        cv2.putText(frame, "MAIN AISLE", (50, 325), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (120, 130, 130), 1)

        # Draw Shelf items (boxes)
        # Shelf A items
        for ix in range(60, 340, 35):
            for iy in range(100, 250, 45):
                # Hide some items later to simulate stock decreasing
                if not (ix > 200 and iy > 150 and frame_idx > 100):
                    cv2.rectangle(frame, (ix, iy), (ix + 25, iy + 35), (80, 120, 200), -1)
                    cv2.rectangle(frame, (ix, iy), (ix + 25, iy + 35), (40, 60, 120), 1)
        
        # Shelf B items
        for ix in range(420, 720, 40):
            for iy in range(100, 190, 40):
                cv2.rectangle(frame, (ix, iy), (ix + 30, iy + 30), (70, 180, 130), -1)
                cv2.rectangle(frame, (ix, iy), (ix + 30, iy + 30), (30, 100, 70), 1)

        # Move and draw shoppers (head + body person shapes)
        for s in shoppers:
            path = s["path"]
            # Compute current position along path
            num_leg = len(path) - 1
            progress = (frame_idx / total_frames) * num_leg
            leg_idx = int(progress)
            leg_pct = progress - leg_idx
            
            if leg_idx >= num_leg:
                curr_x, curr_y = path[-1]
            else:
                p1 = path[leg_idx]
                p2 = path[leg_idx + 1]
                curr_x = int(p1[0] + (p2[0] - p1[0]) * leg_pct)
                curr_y = int(p1[1] + (p2[1] - p1[1]) * leg_pct)
            
            # Draw realistic person figure (Head + Shoulders + Torso + Legs)
            color = s["color"]
            # Head (circle)
            cv2.circle(frame, (curr_x, curr_y - 45), 14, (220, 180, 150), -1)
            # Hair/Cap
            cv2.ellipse(frame, (curr_x, curr_y - 50), (14, 10), 0, 180, 360, (50, 40, 30), -1)
            # Torso / Jacket
            cv2.ellipse(frame, (curr_x, curr_y - 15), (20, 25), 0, 0, 360, color, -1)
            # Legs
            cv2.rectangle(frame, (curr_x - 12, curr_y + 10), (curr_x - 2, curr_y + 40), (40, 40, 60), -1)
            cv2.rectangle(frame, (curr_x + 2, curr_y + 10), (curr_x + 12, curr_y + 40), (40, 40, 60), -1)

        out.write(frame)
        
    out.release()
    print(f"Sample store video saved successfully to {video_path}")

if __name__ == "__main__":
    create_sample_video()
