import os
from pathlib import Path
from dotenv import load_dotenv

# Load workspace .env
env_path = Path(__file__).resolve().parent.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = Path(os.getenv('STORAGE_BASE_DIR', str(BASE_DIR / 'storage')))
UPLOADS_DIR = STORAGE_DIR / 'uploads'
PROCESSED_DIR = STORAGE_DIR / 'processed'
REPORTS_DIR = STORAGE_DIR / 'reports'
THUMBNAILS_DIR = STORAGE_DIR / 'thumbnails'

# Ensure directories exist
for d in [STORAGE_DIR, UPLOADS_DIR, PROCESSED_DIR, REPORTS_DIR, THUMBNAILS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Model Settings
YOLO_MODEL = os.getenv('YOLO_MODEL', 'yolov8n.pt')
DEVICE = os.getenv('DEVICE', 'mps')  # Will auto-fallback to cpu if mps not available
CONF_THRESHOLD = float(os.getenv('CONF_THRESHOLD', 0.25))
IOU_THRESHOLD = float(os.getenv('IOU_THRESHOLD', 0.45))
FRAME_SAMPLE_RATE = int(os.getenv('FRAME_SAMPLE_RATE', 2))
MAX_INFERENCE_WIDTH = int(os.getenv('MAX_INFERENCE_WIDTH', 640))
AI_SERVICE_PORT = int(os.getenv('AI_SERVICE_PORT', 8000))

# COCO Target Classes for Traffic Surveillance
# 0: person, 1: bicycle, 2: car, 3: motorcycle, 5: bus, 7: truck
TARGET_CLASSES = {
    0: 'person',
    1: 'bicycle',
    2: 'car',
    3: 'motorcycle',
    5: 'bus',
    7: 'truck'
}

VEHICLE_CLASSES = {'car', 'motorcycle', 'bus', 'truck', 'bicycle'}
PEDESTRIAN_CLASSES = {'person'}
