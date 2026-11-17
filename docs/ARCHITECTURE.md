# AEGISAI — System Architecture

## Architecture Diagram

```
+-------------------------------------------------------------+
|                     React 18 Frontend                       |
|           (TypeScript, Vite, Tailwind CSS, Lucide)          |
|                   http://localhost:5173                     |
+------------------------------+------------------------------+
                               | REST / HTTP API
                               v
+-------------------------------------------------------------+
|             Java Spring Boot 3.4 Application Backend        |
|                  (Java 21/25/27, JPA, Hibernate)            |
|                   http://localhost:8085                     |
+---------------+------------------------------+--------------+
                |                              |
                v                              v
+-------------------------------+  +--------------------------+
|  Database Layer               |  | Local Storage            |
|  - PostgreSQL (Prod Profile)  |  | - storage/uploads/       |
|  - Embedded H2 (Dev Fallback) |  | - storage/processed/     |
+-------------------------------+  | - storage/reports/       |
                                   | - storage/thumbnails/    |
                                   +--------------------------+
                                               ^
                                               | Annotated MP4 & Reports
                                               |
+----------------------------------------------+--------------+
|             Python AI Inference Service                     |
|           (FastAPI Internal Bridge, Port 8000)              |
|                                                             |
|   +--------------------+     +--------------------------+   |
|   |  Ultralytics YOLO  |     |  ByteTrack Tracker       |   |
|   |  (Pretrained COCO) |     |  (Persistent V/P IDs)    |   |
|   +--------------------+     +--------------------------+   |
|   +--------------------+     +--------------------------+   |
|   | Collision Analysis |     | Video Annotator          |   |
|   | (Kinematic Engine) |     | (Red/Green OpenCV/FFmpeg)|   |
|   +--------------------+     +--------------------------+   |
|   +-----------------------------------------------------+   |
|   | Hardware Acceleration: Apple Silicon MPS (Metal)    |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

## Key Architectural Principles

1. **Separation of Concerns**:
   - **Java Spring Boot**: Exclusive owner of business logic, job lifecycle, entity persistence, video file serving, report downloads, and REST APIs.
   - **Python AI Service**: Headless, micro-inference service dedicated purely to computer vision, tensor operations, tracking math, and video encoding.

2. **Apple Silicon M2 Optimization**:
   - Neural network weights execute on Metal Performance Shaders (`device="mps"`), utilizing unified memory for maximum frame throughput without GPU memory transfer bottlenecks.

3. **Multi-Signal Accident Classification**:
   - Never classifies collisions solely on bounding box overlap.
   - Evaluates inter-centroid proximity, abrupt deceleration (&lt;-15 px/s), and post-impact kinematic cessation across temporal windows.

4. **Zero-Friction Local Execution**:
   - Self-contained H2 file-backed persistence configured for `dev` mode with automatic fallback.
   - PostgreSQL configuration ready for production and Docker Compose environments.
