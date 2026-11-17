# AEGISAI — Development Status & System Environment (Phase 0)

## System Environment
- **Platform**: Apple macOS (Darwin 27.3.0, arm64, Apple Silicon M2)
- **Java**: OpenJDK 25 LTS (`temurin-25.jdk` / OpenJDK 27 from Homebrew available)
- **Maven**: Apache Maven 3.10.1 (installed at `/opt/homebrew/bin/mvn`)
- **Python**: Python 3.13 / 3.14 (PyAV, FastAPI, Uvicorn, PyTorch, Ultralytics, OpenCV)
- **Node.js**: v22.20.0 (npm v10+)
- **FFmpeg**: v9.0.2 with libx264, libvpx, libdav1d, videotoolbox support
- **Git**: v2.56.0
- **Docker**: Docker 29.8.2 (Native local execution enabled for M2 MPS GPU acceleration)

## Uploaded Video Inspection
1. **Primary Video: `accident_vid_1.mp4`**
   - Format/Codec: MP4 / H.264 (`avc1`)
   - Resolution: `816x464`
   - Frame Rate: `60.11 FPS`
   - Duration: `23.56s` (1,416 frames)
   - File Size: `3.93 MB`
   - Status: Complete, verified dashcam/CCTV collision footage.

2. **Secondary Video: `accident_vid_2.mp4`**
   - Format/Codec: MP4 / H.264 (`avc1`)
   - Resolution: `478x850`
   - Frame Rate: `30.00 FPS`
   - Duration: `64.07s` (1,922 frames)
   - File Size: `11.10 MB`
   - Status: Complete, portrait traffic surveillance footage.

3. **Tertiary Video: `accident_vid_3.mp4`**
   - Original Format/Codec: MP4 / HEVC (`hvc1`), `1.86 MB`, `720x1282`, `30 FPS`, `24.37s` (Preserved intact in `storage/test_videos/accident_vid_3_original_hevc.mp4`)
   - Browser-Compatible Copy: H.264 transcode (`storage/test_videos/accident_vid_3.mp4`), `2.0 MB`, ensuring 100% universal browser video playback.

## Architecture Status
- **Backend**: Java Spring Boot 3.x (Java 21/25 compatible) with JPA, H2 local dev fallback, and PostgreSQL support.
- **AI Service**: Python FastAPI + Ultralytics YOLOv8 / YOLO11 + ByteTrack + Collision Analysis Engine with PyTorch MPS acceleration.
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Lucide Icons + Recharts + Zustand.
- **Storage**: Structured local directories (`storage/uploads/`, `storage/processed/`, `storage/reports/`, `storage/thumbnails/`).
