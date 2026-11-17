# AEGISAI — REST API Documentation

Base URL: `http://localhost:8085/api/v1`  
Swagger OpenAPI UI: `http://localhost:8085/swagger-ui.html`

---

## 1. System Health
- **`GET /health`**
  - Returns overall system operational health, Java runtime, database connection state, and AI inference engine acceleration status.

## 2. Video Processing
- **`POST /videos/upload`**
  - Multipart form upload (`file`). Accepts MP4, MOV, and AVI formats.
  - Returns: `videoId`, `originalFilename`, `fileSizeBytes`, `status`.
- **`GET /videos`**
  - Returns list of all registered video surveillance processing jobs.
- **`GET /videos/{id}`**
  - Returns details for a specific video job.
- **`POST /videos/{id}/analyze`**
  - Triggers asynchronous computer vision inference in the background.
- **`GET /videos/{id}/status`**
  - Returns job status (`UPLOADED`, `QUEUED`, `PROCESSING`, `COMPLETED`, `FAILED`) and progress percentage.
- **`GET /videos/{id}/preview`**
  - Streams original uploaded surveillance video.
- **`GET /videos/{id}/annotated`**
  - Streams generated H.264 MP4 annotated video with HUD, Red/Green overlays, and watermark.
- **`GET /videos/{id}/thumbnail`**
  - Returns the first-frame thumbnail image.

## 3. Incidents & Verification
- **`GET /incidents`**
  - Returns list of all detected accident candidates across surveillance jobs.
- **`GET /incidents/{id}`**
  - Returns candidate record including involved vehicles, nearby pedestrians, kinematic evidence signals, and confidence score.
- **`PATCH /incidents/{id}/status`**
  - Updates human review status:
    - `PENDING_VERIFICATION`
    - `UNDER_REVIEW`
    - `VERIFIED`
    - `REJECTED`
    - `RESOLVED`
- **`GET /incidents/{id}/timeline`**
  - Returns chronological timeline of events for the incident.

## 4. Vehicle Intelligence
- **`GET /vehicles?videoId={videoId}`**
  - Returns list of tracked vehicles (`V-001`, `V-002`), collision involvement tags, detection confidence, and structural damage assessments.
- **`GET /vehicles/{id}`**
  - Returns specific vehicle assessment record.

## 5. Pedestrian Intelligence
- **`GET /pedestrians?videoId={videoId}`**
  - Returns list of tracked pedestrians (`P-001`), movement states, collision proximity zones, warning levels, and medical limitations.
- **`GET /pedestrians/{id}`**
  - Returns specific pedestrian record.

## 6. Reports
- **`GET /reports/{incidentId}`**
  - Returns full incident dossier in structured JSON.
- **`GET /reports/{incidentId}/download`**
  - Downloads printable, enterprise-styled HTML/PDF emergency incident dossier.
