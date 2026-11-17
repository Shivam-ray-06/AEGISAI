# AEGISAI — Python AI & Computer Vision Inference Engine

The **AEGISAI AI Engine** is a high-performance computer vision and physical kinematics analysis service. It ingests traffic and surveillance footage, tracks multiple moving entities across frames, isolates genuine physical collisions from normal dense traffic using deterministic physics rules, quantifies structural chassis deformation, and renders tactical annotated video streams.

---

## Technical Architecture

- **Runtime**: Python 3.12 / 3.13
- **Deep Learning**: PyTorch, Ultralytics YOLOv8 (轻量级 lightweight `yolov8n.pt`)
- **Tracking Algorithm**: ByteTrack (configured via `bytetrack.yaml`)
- **Computer Vision & Video Rendering**: OpenCV (`cv2`), Pillow, NumPy, SciPy
- **Video Transcoding**: FFmpeg (H.264 `yuv420p` encoding for zero-lag browser playback)
- **Service Interface**: FastAPI + Uvicorn (internal microservice port 8000)

---

## Core Capabilities & Pipelines

### 1. Multi-Class Object Detection & ByteTrack Association
Detects and tracks 6 standard traffic classes across video frames:
- `car`, `truck`, `bus`, `motorcycle`, `bicycle`, `person`
- Generates persistent entity IDs (`V-001`, `V-002`, `P-001`, etc.) with continuous velocity vectors, bounding coordinates, and trajectory history.

### 2. The Jev Expert Decision Gatekeeper (`collision_analyzer.py`)
To prevent false alarms in dense traffic where vehicles travel near each other or right-hand shoulder vehicles are in frame, the Jev gatekeeper enforces strict physical criteria:
- **Spatial Hull Encroachment**: Evaluates 2D Intersection-over-Union ($IoU \ge 0.15$) and centroid distance thresholds.
- **Catastrophic Kinetic Delta-V Drop**: Requires acute deceleration ($\Delta v \le -30.0\text{ px/s}$) coincident with spatial contact.
- **Horizon & Shoulder Filtering**: Excludes distant background vehicles ($y < 120\text{px}$) from triggering false collisions.
- **Display-ID Scoped Tagging**: Collided vehicles are tagged specifically by their canonical display ID.

### 3. Tactical Video Annotator (`annotator.py`)
Renders tactical HUD overlays with strict visual geometry:
- **RED SQUARE BOX**: Collided vehicles (`[COLLIDED]`).
- **GREEN SQUARE BOX**: Safe vehicles in traffic (`[SAFE]`).
- **RED CIRCLE**: Pedestrians in direct collision impact path (`[INJURED/CASUALTY]`).
- **GREEN CIRCLE**: Normal commuters and safe pedestrians (`[SAFE]`).
- **Tactical Watermark**: Top HUD banner with real-time video timestamp and FPS.
- **HUD Legend**: Bottom overlay explaining all color and shape meanings.

### 4. Structural Deformation Quantification Engine (SID-QE) (`structural_deformation.py`)
Implements Campbell / CRASH3 Automotive Energy-Equivalent Speed (EES) kinetic modeling:
- Quantifies exact **Impact Deformation Percentages** (e.g. `48.5%` frontal crumple on `V-001`, `46.2%` quarter intrusion on `V-173`).
- Estimates crush depth in centimeters ($d_{crush}$).
- Assesses structural integrity index and drivability classifications (`TOTAL_LOSS`, `IMMOBILIZED`, `DRIVABLE_HAZARD`, `NOMINAL`).

---

## Standalone Pipeline Execution

You can run the analysis pipeline directly via CLI:
```bash
python -c "from ai_engine.pipeline import AnalysisPipeline; p = AnalysisPipeline(); p.run('storage/uploads/your_video.mp4', 'VID-001')"
```

---

## Starting the AI Microservice

```bash
uvicorn ai_engine.service:app --host 0.0.0.0 --port 8000 --reload
```
Health endpoint: `http://localhost:8000/health`
