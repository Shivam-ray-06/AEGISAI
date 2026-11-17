# AEGISAI — University Demonstration Guide

## Demonstration Overview
AEGISAI (Artificial Emergency Guidance & Intelligent Surveillance using AI) is an autonomous road accident intelligence platform developed for macOS (optimized for Apple Silicon M2). It ingests CCTV and dashcam traffic video, detects and tracks vehicles and pedestrians, identifies candidate collision events, and generates an emergency incident dashboard with annotated video playback and downloadable incident reports.

---

## Exact 16-Step Demonstration Walkthrough

1. **Launch AEGISAI**:
   Run `./scripts/start.sh` in the terminal.
   Open your browser to [http://localhost:5173](http://localhost:5173).

2. **Command Overview**:
   - Show the summary cards: *Videos Processed*, *Vehicles Tracked*, *Pedestrians Tracked*, and *Suspected Incidents*.
   - Point out the real-time detection telemetry area chart and the incident candidate alert queue.

3. **Navigate to Video Upload**:
   - Click **Video Upload & Analysis** on the sidebar.
   - Show the drag-and-drop ingestion zone with format validation (MP4, MOV, AVI).

4. **Upload the Accident Video**:
   - Drag or browse `storage/test_videos/accident_vid_1.mp4`.
   - The UI displays file name, file size, and provides an immediate pre-analysis HTML5 video preview.

5. **Start AI Analysis**:
   - Click the electric cyan **Start Analysis** button.
   - Show the real-time progress bar. The Java backend creates an asynchronous job and communicates with the Python AI engine.

6. **Inference Telemetry**:
   - The Python AI engine uses Ultralytics YOLOv8 with ByteTrack running on Apple Silicon MPS hardware acceleration.
   - Processing completes in ~30–40 seconds for a full 24-second, 60 FPS video (1,416 frames).

7. **Review Live Analysis**:
   - Once completed, click **Live Analysis** on the sidebar.
   - Point out the side-by-side view toggle (Annotated View vs Original Source).
   - Play the annotated video.

8. **Show Red/Green Object Annotations**:
   - **Green Rectangles**: Normal vehicles not involved in the collision.
   - **Red Rectangles**: Vehicles involved in the collision event (`V-123`, `V-144`).
   - **Green Circles**: Pedestrians in the safe outer perimeter.
   - **Red/Amber Circles**: Pedestrians located within the collision proximity perimeter.
   - Note the HUD banner, incident timestamp (`T+11.2s`), on-screen legend, and AEGISAI watermark.

9. **Open Vehicle Intelligence**:
   - Click **Vehicle Intelligence** on the sidebar.
   - Show the vehicle cards displaying persistent tracking IDs (`V-001`, `V-002`), detection confidence, and collision involvement tags.
   - Highlight the ethical safety notice: *"Vehicle damage assessment unavailable — manual visual inspection required"*.

10. **Open Pedestrian & Victim Intelligence**:
    - Click **Pedestrian Intelligence** on the sidebar.
    - Show tracked pedestrians (`P-001`, `P-002`) with proximity zones and movement states (*"Movement detected"*, *"No movement detected during observation window"*).
    - Emphasize the mandatory medical disclaimer: Ordinary CCTV cannot determine consciousness or breathing; human emergency assessment is required.

11. **Review Emergency Alerts & Human Verification Workflow**:
    - Click **Emergency Alerts** on the sidebar.
    - Demonstrate the verification buttons:
      - Click **Mark Under Review**
      - Click **Verify Accident**
      - Note how the status changes from `PENDING_VERIFICATION` to `VERIFIED` in real time.

12. **Explore Global Incident Map & City Intelligence**:
    - Click **Global Incident Map** to see the geospatial radar overview.
    - Click **City Accident Intelligence** to review intersection risk comparisons.

13. **Open Medical Digital Twin**:
    - Click **Medical Digital Twin** to view the triage dispatch priority queue.

14. **Inspect Incident Dossier & Download Report**:
    - Click **Incident Reports** on the sidebar.
    - Show the in-browser incident dossier preview.
    - Click **Printable Dossier** to open or print the clean HTML/PDF report.
    - Click **Download JSON** to inspect the structured forensic telemetry data.

15. **System Monitoring & Diagnostics**:
    - Click **System Monitoring** to show the live diagnostics of the Java Spring Boot 3.4 backend, Python AI Engine with Apple MPS, and database status.

16. **Shutdown**:
    - Run `./scripts/stop.sh` in the terminal to stop all services.
