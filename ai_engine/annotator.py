import cv2
import numpy as np
import os
import subprocess
from pathlib import Path
from typing import Dict, List, Set

class VideoAnnotator:
    def __init__(self, output_path: str, fps: float, width: int, height: int):
        self.output_path = output_path
        self.temp_raw_path = str(Path(output_path).with_suffix('.raw.mp4'))
        self.fps = fps
        self.width = width
        self.height = height
        
        # Colors (BGR for OpenCV)
        # RED: Vehicles/Persons directly in accident
        self.COLOR_RED = (40, 40, 245)        # Emergency Alert Red (#F52828 in BGR)
        # GREEN: Normal vehicles in traffic / people who didn't get hurt
        self.COLOR_GREEN = (40, 220, 60)      # High-Vis Tactical Green (#3CDC28 in BGR)
        
        self.COLOR_AMBER = (0, 165, 255)      # Warning Amber
        self.COLOR_CYAN = (235, 206, 135)     # AEGISAI HUD Cyan
        self.COLOR_DARK_BG = (14, 18, 26)     # Deep Charcoal
        self.COLOR_TEXT = (255, 255, 255)
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        self.writer = cv2.VideoWriter(self.temp_raw_path, fourcc, fps, (width, height))

    def draw_hud(self, frame: np.ndarray, current_timestamp: float, has_incident_candidate: bool, incident_time: float = None):
        """Draws professional aerospace/emergency command HUD watermark and status legend"""
        h, w = frame.shape[:2]
        
        # 1. Top HUD Banner (AEGISAI Watermark & Status)
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, 52), (12, 17, 26), -1)
        cv2.addWeighted(overlay, 0.75, frame, 0.25, 0, frame)
        
        # Brand & Status Text
        cv2.putText(frame, "AEGISAI :: INCIDENT INTELLIGENCE HUD", (16, 32), 
                    cv2.FONT_HERSHEY_DUPLEX, 0.75, (235, 206, 135), 2, cv2.LINE_AA)
        
        time_text = f"T+{current_timestamp:05.2f}s | FPS: {self.fps:.1f}"
        cv2.putText(frame, time_text, (w - 230, 32), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 210, 220), 1, cv2.LINE_AA)

        # 2. Incident Alert Banner if incident is active near current time
        if incident_time is not None and abs(current_timestamp - incident_time) < 4.0:
            alert_box_w = 460
            alert_x1 = (w - alert_box_w) // 2
            cv2.rectangle(frame, (alert_x1, 62), (alert_x1 + alert_box_w, 98), (20, 20, 180), -1)
            cv2.rectangle(frame, (alert_x1, 62), (alert_x1 + alert_box_w, 98), (41, 57, 235), 2)
            alert_text = f"! COLLISION EVENT DETECTED @ {incident_time:.1f}s !"
            cv2.putText(frame, alert_text, (alert_x1 + 16, 86), 
                        cv2.FONT_HERSHEY_DUPLEX, 0.58, (255, 255, 255), 2, cv2.LINE_AA)

        # 3. Bottom Legend Box (HUD Tactical Overlay: Red & Green Squares and Circles)
        legend_h = 52
        legend_w = 640
        legend_y = h - legend_h - 12
        legend_x = 14
        
        overlay_leg = frame.copy()
        cv2.rectangle(overlay_leg, (legend_x, legend_y), (legend_x + legend_w, legend_y + legend_h), (10, 14, 22), -1)
        cv2.addWeighted(overlay_leg, 0.85, frame, 0.15, 0, frame)
        cv2.rectangle(frame, (legend_x, legend_y), (legend_x + legend_w, legend_y + legend_h), (50, 70, 95), 1)

        # RED INDICATOR: Collided Vehicles (Square) & Person in Accident (Circle)
        cv2.rectangle(frame, (legend_x + 12, legend_y + 12), (legend_x + 24, legend_y + 24), self.COLOR_RED, -1)
        cv2.circle(frame, (legend_x + 36, legend_y + 18), 6, self.COLOR_RED, -1)
        cv2.putText(frame, "RED: Collided Car (Square) / Person in Accident (Circle)", (legend_x + 48, legend_y + 22),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.40, (240, 245, 250), 1, cv2.LINE_AA)

        # GREEN INDICATOR: Normal Traffic (Square) & Unhurt Pedestrians (Circle)
        cv2.rectangle(frame, (legend_x + 12, legend_y + 32), (legend_x + 24, legend_y + 44), self.COLOR_GREEN, -1)
        cv2.circle(frame, (legend_x + 36, legend_y + 38), 6, self.COLOR_GREEN, -1)
        cv2.putText(frame, "GREEN: Safe Traffic Car (Square) / Normal Pedestrian (Circle)", (legend_x + 48, legend_y + 42),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.40, (200, 255, 200), 1, cv2.LINE_AA)

    def annotate_frame(
        self, 
        frame: np.ndarray, 
        active_detections: List[Dict], 
        current_timestamp: float, 
        flagged_ids: Set[int] = None, 
        incident_time: float = None,
        confirmed_vehicle_display_ids: Set[str] = None,
        confirmed_pedestrian_display_ids: Set[str] = None
    ) -> np.ndarray:
        """
        Draws vehicles (square box) and pedestrians (circular marker)
        with strict color differentiation:
        - RED SQUARE: Vehicles that collided with each other in the accident
        - GREEN SQUARE: Safe vehicles in traffic (not hurt / normal flow)
        - RED CIRCLE: Persons who were in the accident
        - GREEN CIRCLE: Normal pedestrians / people who didn't get hurt
        """
        annotated = frame.copy()
        flagged_raw = flagged_ids or set()
        conf_veh = confirmed_vehicle_display_ids if confirmed_vehicle_display_ids is not None else set()
        conf_ped = confirmed_pedestrian_display_ids if confirmed_pedestrian_display_ids is not None else set()

        for det in active_detections:
            raw_id = det['raw_id']
            display_id = det['display_id']
            category = det['category']
            class_name = det['class_name']
            conf = det['conf']
            bbox = det['bbox']
            
            x1, y1, x2, y2 = [int(v) for v in bbox]
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2

            if category == 'VEHICLE':
                # Strictly check if this vehicle is confirmed to have collided
                if confirmed_vehicle_display_ids is not None:
                    is_flagged = display_id in conf_veh
                else:
                    is_flagged = raw_id in flagged_raw

                # Red if collided, Green if safe in traffic
                color = self.COLOR_RED if is_flagged else self.COLOR_GREEN
                thickness = 3 if is_flagged else 2
                
                # Rectangular square box for vehicles
                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, thickness)
                
                # Corner accents for tactical precision
                c_len = max(8, min(20, (x2 - x1) // 4))
                cv2.line(annotated, (x1, y1), (x1 + c_len, y1), (255, 255, 255), 2)
                cv2.line(annotated, (x1, y1), (x1, y1 + c_len), (255, 255, 255), 2)
                cv2.line(annotated, (x2, y2), (x2 - c_len, y2), (255, 255, 255), 2)
                cv2.line(annotated, (x2, y2), (x2, y2 - c_len), (255, 255, 255), 2)
                
                # Tag label
                status_txt = "COLLIDED" if is_flagged else "SAFE"
                label = f"{display_id} [{status_txt}] {conf*100:.0f}%"
                (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.44, 1)
                
                # Label badge background
                tag_y1 = max(0, y1 - th - 8)
                cv2.rectangle(annotated, (x1, tag_y1), (x1 + tw + 10, y1), color, -1)
                text_color = (255, 255, 255) if is_flagged else (0, 0, 0)
                cv2.putText(annotated, label, (x1 + 5, y1 - 4), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.44, text_color, 1, cv2.LINE_AA)
            else:
                # Pedestrian: Strictly check if person was in the accident
                if confirmed_pedestrian_display_ids is not None:
                    is_flagged = display_id in conf_ped
                else:
                    is_flagged = raw_id in flagged_raw

                # Red if person in accident, Green if safe commuter/pedestrian
                color = self.COLOR_RED if is_flagged else self.COLOR_GREEN
                radius = max(24, int(max(x2 - x1, y2 - y1) / 1.7))
                thickness = 3 if is_flagged else 2
                
                # Circular marker for pedestrians
                cv2.circle(annotated, (cx, cy), radius, color, thickness)
                # Outer radar ring
                cv2.circle(annotated, (cx, cy), radius + 4, color, 1)
                # Centroid pin
                cv2.circle(annotated, (cx, cy), 3, color, -1)
                
                status_txt = "INJURED/CASUALTY" if is_flagged else "SAFE"
                label = f"{display_id} [{status_txt}]"
                (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.42, 1)
                tag_y = max(0, cy - radius - 6)
                cv2.rectangle(annotated, (cx - tw//2 - 5, tag_y - th - 4), (cx + tw//2 + 5, tag_y + 2), color, -1)
                text_color = (255, 255, 255) if is_flagged else (0, 0, 0)
                cv2.putText(annotated, label, (cx - tw//2, tag_y - 2), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.42, text_color, 1, cv2.LINE_AA)

        # Draw HUD overlays
        self.draw_hud(annotated, current_timestamp, bool(flagged_ids), incident_time)
        return annotated

    def write_frame(self, frame: np.ndarray):
        self.writer.write(frame)

    def finalize(self):
        self.writer.release()
        
        # Transcode raw video to universally playable H.264 mp4 (yuv420p) using ffmpeg
        ffmpeg_bin = "/opt/homebrew/bin/ffmpeg" if os.path.exists("/opt/homebrew/bin/ffmpeg") else "ffmpeg"
        cmd = [
            ffmpeg_bin, "-y",
            "-i", self.temp_raw_path,
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            self.output_path
        ]
        try:
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            if os.path.exists(self.temp_raw_path):
                os.remove(self.temp_raw_path)
        except Exception as e:
            print(f"[AEGISAI Annotator] Warning: FFmpeg transcoding step: {e}")
            if os.path.exists(self.temp_raw_path) and not os.path.exists(self.output_path):
                os.rename(self.temp_raw_path, self.output_path)
