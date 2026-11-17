import math
from typing import Dict, List, Optional, Tuple
from .config import TARGET_CLASSES, VEHICLE_CLASSES, PEDESTRIAN_CLASSES

class TrackedEntity:
    def __init__(self, raw_id: int, class_name: str, display_id: str, first_timestamp: float, first_frame: int):
        self.raw_id = raw_id
        self.class_name = class_name
        self.display_id = display_id
        self.category = 'VEHICLE' if class_name in VEHICLE_CLASSES else 'PEDESTRIAN'
        self.first_timestamp = first_timestamp
        self.last_timestamp = first_timestamp
        self.first_frame = first_frame
        self.last_frame = first_frame
        self.history: List[Dict] = []  # [{frame, timestamp, bbox, center, speed, angle}]
        self.confidence_sum = 0.0
        self.detections_count = 0
        self.is_incident_candidate = False
        self.incident_involvement_reason = ""
        self.movement_status = "Tracking active"
        
    @property
    def avg_confidence(self) -> float:
        return self.confidence_sum / max(1, self.detections_count)
        
    def add_observation(self, frame_idx: int, timestamp: float, bbox: List[float], conf: float):
        x1, y1, x2, y2 = bbox
        cx = (x1 + x2) / 2.0
        cy = (y1 + y2) / 2.0
        
        speed = 0.0
        angle = 0.0
        
        if self.history:
            prev = self.history[-1]
            dt = max(0.001, timestamp - prev['timestamp'])
            dx = cx - prev['center'][0]
            dy = cy - prev['center'][1]
            dist = math.hypot(dx, dy)
            speed = dist / dt  # pixels per second
            angle = math.degrees(math.atan2(dy, dx))
            
        self.history.append({
            'frame': frame_idx,
            'timestamp': round(timestamp, 3),
            'bbox': [round(v, 2) for v in bbox],
            'center': (round(cx, 2), round(cy, 2)),
            'speed': round(speed, 2),
            'angle': round(angle, 2),
            'conf': round(conf, 3)
        })
        
        self.last_timestamp = timestamp
        self.last_frame = frame_idx
        self.confidence_sum += conf
        self.detections_count += 1
        
    def get_recent_speed_change(self, window=5) -> float:
        """Returns deceleration / acceleration metric over last N observations"""
        if len(self.history) < 2:
            return 0.0
        recent = self.history[-window:]
        if len(recent) < 2:
            return 0.0
        speeds = [item['speed'] for item in recent]
        return speeds[-1] - speeds[0]

    def get_trajectory_points(self, max_points=30) -> List[Tuple[float, float]]:
        return [item['center'] for item in self.history[-max_points:]]


class TrackManager:
    def __init__(self):
        self.entities: Dict[int, TrackedEntity] = {}
        self.vehicle_counter = 0
        self.pedestrian_counter = 0
        
    def get_or_create(self, raw_id: int, class_id: int, timestamp: float, frame_idx: int) -> TrackedEntity:
        if raw_id in self.entities:
            return self.entities[raw_id]
            
        class_name = TARGET_CLASSES.get(class_id, 'vehicle')
        if class_name in VEHICLE_CLASSES:
            self.vehicle_counter += 1
            display_id = f"V-{self.vehicle_counter:03d}"
        else:
            self.pedestrian_counter += 1
            display_id = f"P-{self.pedestrian_counter:03d}"
            
        entity = TrackedEntity(raw_id, class_name, display_id, timestamp, frame_idx)
        self.entities[raw_id] = entity
        return entity
        
    def update(self, raw_id: int, class_id: int, bbox: List[float], conf: float, timestamp: float, frame_idx: int) -> TrackedEntity:
        entity = self.get_or_create(raw_id, class_id, timestamp, frame_idx)
        entity.add_observation(frame_idx, timestamp, bbox, conf)
        return entity
        
    def get_all_vehicles(self) -> List[TrackedEntity]:
        return [e for e in self.entities.values() if e.category == 'VEHICLE']
        
    def get_all_pedestrians(self) -> List[TrackedEntity]:
        return [e for e in self.entities.values() if e.category == 'PEDESTRIAN']
