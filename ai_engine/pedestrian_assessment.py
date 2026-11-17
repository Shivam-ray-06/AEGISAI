import math
from typing import Dict, List, Optional
from .tracker import TrackedEntity

MOVEMENT_STATUSES = [
    "Movement detected",
    "No movement detected during observation window",
    "Tracking lost",
    "Uncertain"
]

class PedestrianIntelligenceAssessor:
    """
    Pedestrian & Victim Intelligence Module.
    CRITICAL SAFETY PROTOCOL:
    - Never describe movement as proof of consciousness or breathing.
    - Never fabricate medical diagnoses or injury severity.
    - Transparently state limitations (CCTV cannot determine physiological vitals).
    """
    def __init__(self, observation_window_sec: float = 3.0):
        self.observation_window_sec = observation_window_sec

    def assess_pedestrian(self, person: TrackedEntity, is_involved_or_nearby: bool, incident_timestamp: float = 0.0) -> Dict:
        history = person.history
        last_obs = history[-1] if history else {}
        bbox = last_obs.get('bbox', [0, 0, 0, 0])
        
        # Analyze motion across observation window
        movement_status = "Uncertain"
        total_displacement = 0.0
        
        if len(history) >= 2:
            first_pos = history[0]['center']
            last_pos = history[-1]['center']
            total_displacement = math.hypot(last_pos[0] - first_pos[0], last_pos[1] - first_pos[1])
            
            # Check recent speeds
            recent_speeds = [h['speed'] for h in history[-8:]]
            avg_recent_speed = sum(recent_speeds) / max(1, len(recent_speeds))
            
            if total_displacement > 25.0 or avg_recent_speed > 8.0:
                movement_status = "Movement detected"
            elif total_displacement < 10.0 and len(history) > 10:
                movement_status = "No movement detected during observation window"
            else:
                movement_status = "Movement detected"
        else:
            movement_status = "Tracking lost" if len(history) == 1 else "Uncertain"

        # Determine warning level and review status
        if is_involved_or_nearby:
            review_status = "CRITICAL_HUMAN_ASSESSMENT_REQUIRED"
            warning_level = "RED" if movement_status == "No movement detected during observation window" else "AMBER"
        else:
            review_status = "UNINVOLVED_BYSTANDER"
            warning_level = "GREEN"

        return {
            "personId": person.display_id,
            "detectionConfidence": round(person.avg_confidence, 3),
            "markerType": "CIRCULAR_ZONE",
            "eventTimestamp": round(incident_timestamp if is_involved_or_nearby else person.first_timestamp, 2),
            "positionInVideo": {
                "bbox": bbox,
                "center": last_obs.get('center', (0, 0)),
                "firstSeen": round(person.first_timestamp, 2),
                "lastSeen": round(person.last_timestamp, 2)
            },
            "movementTrajectory": person.get_trajectory_points(max_points=20),
            "collisionProximity": "Immediate Perimeter (<5m estimated)" if is_involved_or_nearby else "Outer Zone",
            "movementStatus": movement_status,
            "warningLevel": warning_level,
            "reviewStatus": review_status,
            # Mandatory ethical & medical safety fields
            "medicalDisclaimer": {
                "age": "Not estimated.",
                "height": "Not estimated.",
                "consciousness": "Not determinable from ordinary CCTV.",
                "breathing": "Not determinable from ordinary CCTV.",
                "injuryStatus": "Unknown — immediate human emergency medical assessment required."
            }
        }
