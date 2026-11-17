import torch
from ultralytics import YOLO
from .config import YOLO_MODEL, DEVICE, CONF_THRESHOLD, IOU_THRESHOLD, TARGET_CLASSES

class ObjectDetector:
    def __init__(self, model_name=None, device=None):
        self.model_name = model_name or YOLO_MODEL
        # Verify device
        if device is None:
            if torch.backends.mps.is_available():
                self.device = 'mps'
            elif torch.cuda.is_available():
                self.device = 'cuda'
            else:
                self.device = 'cpu'
        else:
            self.device = device
            
        print(f"[AEGISAI AI Engine] Initializing YOLO ({self.model_name}) on device: {self.device}")
        self.model = YOLO(self.model_name)
        
    def detect_and_track_frame(self, frame, persist=True):
        """
        Runs Ultralytics ByteTrack on a single frame.
        Filters for vehicles and pedestrians.
        """
        # Run track with ByteTrack configuration
        results = self.model.track(
            source=frame,
            persist=persist,
            tracker="bytetrack.yaml",
            conf=CONF_THRESHOLD,
            iou=IOU_THRESHOLD,
            classes=list(TARGET_CLASSES.keys()),
            device=self.device,
            verbose=False
        )
        return results[0] if results else None
