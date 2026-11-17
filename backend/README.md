# AEGISAI — Java Spring Boot Application Backend

The **AEGISAI Backend** is the core orchestrator and enterprise business logic tier of the platform. Built with **Java 21** and **Spring Boot 3.4**, it manages multi-feed surveillance ingestion, asynchronous AI inference job scheduling, incident persistence, forensic reporting, and secure RESTful APIs.

---

## Technical Stack & Architecture

- **Language & Runtime**: Java 21 (LTS)
- **Framework**: Spring Boot 3.4.x
- **Persistence & ORM**: Spring Data JPA, Hibernate ORM
- **Database Support**:
  - **Production**: PostgreSQL 16+
  - **Local Development / Offline Demo**: Automatic fallback to in-memory H2 database
- **REST & Documentation**: Spring Web, Spring Validation, Springdoc OpenAPI 3 (Swagger UI)
- **Utilities**: Lombok, Jackson JSON, Spring RestClient / WebClient

---

## Core Responsibilities

1. **Video Ingestion & File Storage**: Handles multi-part file uploads (MP4, MOV, AVI), validates bitstream integrity, extracts duration/resolution, and creates tracking records.
2. **AI Inference Job Orchestration**: Asynchronously invokes the Python AI inference service via non-blocking HTTP requests, polling job progress and storing analysis results upon completion.
3. **Incident & Collision Intelligence**: Stores candidate collisions, kinematic evidence vectors, bounding telemetry, and operator review states (`PENDING_VERIFICATION`, `UNDER_REVIEW`, `VERIFIED_COLLISION`, `DISMISSED`).
4. **Damage & Pedestrian Casualty Persistence**: Stores structural deformation metrics (crush depth, drivability, impact zones) and triage data.
5. **Report Delivery**: Streams forensic PDF and JSON reports, annotated video files, and video thumbnail stills.

---

## Key REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/videos/upload` | Upload surveillance video file and initialize analysis job |
| `GET` | `/api/v1/videos/{videoId}/status` | Check processing status and percentage progress |
| `GET` | `/api/v1/videos/{videoId}/annotated` | Stream the rendered H.264 annotated video |
| `GET` | `/api/v1/videos/{videoId}/thumbnail` | Fetch representative high-resolution frame thumbnail |
| `GET` | `/api/v1/incidents` | List all detected candidate collisions across videos |
| `PUT` | `/api/v1/incidents/{incidentId}/status`| Update operator triage status |
| `GET` | `/api/v1/vehicles` | Retrieve vehicle intelligence & deformation assessments |
| `GET` | `/api/v1/pedestrians` | Retrieve pedestrian casualty triage evaluations |
| `GET` | `/api/v1/reports/{videoId}` | Download comprehensive forensic JSON report |
| `GET` | `/api/v1/health` | Comprehensive system health check (DB, AI Engine, Storage) |

---

## Configuration (`application.yml` / `.env`)

Environment variables are loaded from the root `.env` or overridden via standard Spring configurations:
```properties
server.port=8085
aegisai.ai-service.url=http://localhost:8000
aegisai.storage.base-dir=./storage
spring.datasource.url=jdbc:postgresql://localhost:5432/aegisai
spring.datasource.username=aegisai
spring.datasource.password=aegisai_secure_pass_2026
```

---

## Building & Running

### Build with Maven
```bash
mvn clean package -DskipTests
```

### Run Executable JAR
```bash
java -jar target/aegisai-backend-1.0.0.jar
```

### Access Swagger API Documentation
Open your browser at:
`http://localhost:8085/swagger-ui/index.html`
