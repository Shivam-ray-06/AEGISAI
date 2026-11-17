# AEGISAI — Artificial Emergency Guidance & Intelligent Surveillance using AI

<p align="center">
  <img src="frontend/public/vite.svg" width="80" height="80" alt="AEGISAI Logo" />
</p>

<p align="center">
  <strong>Next-Generation Autonomous Road Accident Intelligence, Vehicle Telemetry & Emergency Response Dispatch Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/YOLO-v8n-00FFFF?style=for-the-badge&logo=ultralytics&logoColor=black" alt="YOLOv8" />
  <img src="https://img.shields.io/badge/PyTorch-2.x-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="MIT License" />
</p>

---

## 📌 Executive Summary

**AEGISAI** (*Artificial Emergency Guidance & Intelligent Surveillance using AI*) is an enterprise-grade AI road safety platform. It ingests surveillance and dashcam video feeds, detects and tracks moving vehicles and pedestrians, isolates real accident events from dense traffic with high precision using the **Jev Expert Decision Gatekeeper**, calculates structural chassis deformation percentages, and orchestrates rapid emergency triage and response dispatch.

---

## 🌟 Key Platform Features

### 1. High-Precision AI Detection & ByteTrack Association
- Ingests MP4, MOV, and AVI surveillance video streams.
- Identifies 6 core traffic entity classes: `car`, `truck`, `bus`, `motorcycle`, `bicycle`, and `person`.
- Maintains persistent entity tracking IDs (`V-001`, `V-002`, `P-001`, etc.) across frame occlusions, camera movements, and lighting shifts using ByteTrack.

### 2. The Jev Expert Decision Gatekeeper & Kinetic Deceleration Filter
- Eliminates dense traffic false alarms on highway shoulders and parallel lanes.
- Analyzes pairwise 2D spatial hull encroachment ($IoU \ge 0.15$), centroid proximity, and sudden kinetic velocity drops ($\Delta v \le -30.0\text{ px/s}$).
- In dense traffic feeds with 300+ vehicles, it isolates strictly the genuine colliding vehicles while classifying passing traffic as safe.

### 3. Strict HUD Visual Annotation Protocol
Every frame rendered by the AEGISAI annotator strictly follows an intuitive visual geometry:
- 🟥 **RED SQUARE BOX (`[COLLIDED]`)**: Vehicles directly involved in the accident collision.
- 🟩 **GREEN SQUARE BOX (`[SAFE]`)**: Safe vehicles in traffic (not hurt / moving in normal flow).
- 🔴 **RED CIRCLE (`[INJURED/CASUALTY]`)**: Pedestrians in direct collision impact path.
- 🟢 **GREEN CIRCLE (`[SAFE]`)**: Pedestrians and commuters who did not get hurt.
- **Tactical HUD Watermark**: Top status bar displaying real-time video timestamp and FPS.
- **HUD Legend Box**: Bottom-left overlay detailing color and shape definitions.

### 4. Vehicle Intelligence & Structural Deformation Assessment (SID-QE)
- Implements Campbell / CRASH3 Automotive Energy-Equivalent Speed (EES) kinetic modeling.
- Determines exact **Impact Deformation Percentages** and estimated crush depth ($d_{crush}$) in centimeters.
- **Interactive Multi-Quadrant Chassis Heatmaps**: Realistic top-down SVG rendering for both **Sedan / SUV** and **Motorcycle / Bike** vehicle types showing damaged zones in real time.

### 5. Medical Digital Twin & Emergency Triage Support
- Generates AIS (Abbreviated Injury Scale) anatomical injury predictions for vehicle occupants and pedestrians based on kinetic impact vectors.
- Assigns Priority 1–4 triage dispatch ratings with immediate trauma protocol recommendations.

### 6. Interactive Global Incident Map
- Real-world OpenStreetMap integration with smooth zooming.
- Enables operators to zoom from country and state views down to exact city streets, lanes, and collision GPS coordinates.

### 7. Forensic Reporting & PDF Export
- Generates downloadable forensic PDF reports including:
  - Exact time, date, and geolocation of the incident.
  - Vehicle details (make, model, license plate ID, and deformation percentage).
  - Casualty and injury summary.
  - First responder units dispatched (Police PCR, ALS Ambulances, Fire Rescue).

### 8. Top-Right Quick Notification Hub
- Integrated notification popover in the top navbar with a shield icon displaying pending incident reviews at a glance.

---

## 🏛️ System Architecture

AEGISAI operates as an asynchronous, tri-tier modular system:

```
┌─────────────────────────────────────────────────────────────┐
│                      React 18 Frontend                      │
│        (TypeScript • Vite • Tailwind CSS • Leaflet)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST APIs (Port 5173 ➔ 8085)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Java Spring Boot 3.4 Backend                  │
│       (Spring Data JPA • Hibernate • PostgreSQL / H2)       │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼ Local Storage                ▼ HTTP (Port 8000)
    ┌──────────────────────┐   ┌──────────────────────────────┐
    │   storage/           │   │    Python 3.12 AI Engine     │
    │   ├── uploads/       │   │ (YOLOv8 • ByteTrack • OpenCV │
    │   ├── processed/     │   │  Jev Gatekeeper • SID-QE)    │
    │   └── reports/       │   └──────────────────────────────┘
    └──────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Leaflet, Framer Motion, Zustand, Axios |
| **Java Backend** | Java 21, Spring Boot 3.4, Spring Data JPA, Hibernate, PostgreSQL, H2 (dev fallback), Lombok, Springdoc OpenAPI |
| **AI Inference** | Python 3.12/3.13, PyTorch, Ultralytics YOLOv8, ByteTrack, OpenCV, NumPy, SciPy, Pillow, FFmpeg, FastAPI |
| **DevOps & Tooling** | Docker, Docker Compose, Git, Maven, npm |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java**: OpenJDK 21 or higher
- **Node.js**: v18 or higher (with npm)
- **Python**: 3.12 or 3.13
- **FFmpeg**: Installed and available in your PATH

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AEGISAI.git
cd AEGISAI
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Automated Launch (Single Script)
Use the included startup script to launch all 3 services simultaneously:
```bash
chmod +x scripts/start.sh scripts/stop.sh
./scripts/start.sh
```

### 4. Manual Launch (Step-by-Step)

#### Step 4.1: Launch Python AI Engine
```bash
# In project root
export PYTHONPATH="."
python3 -m uvicorn ai_engine.service:app --host 0.0.0.0 --port 8000
```
*Health Check: `http://localhost:8000/health`*

#### Step 4.2: Launch Java Spring Boot Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/aegisai-backend-1.0.0.jar --server.port=8085
```
*Health Check: `http://localhost:8085/api/v1/health`*
*Swagger API Docs: `http://localhost:8085/swagger-ui/index.html`*

#### Step 4.3: Launch React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Access UI: `http://localhost:5173`*

---

## 📂 Repository Directory Structure

```
AEGISAI/
├── .env.example             # Sanitized environment template
├── .gitignore               # Comprehensive Git ignore rules
├── LICENSE                  # MIT License
├── README.md                # Master repository documentation
├── CONTRIBUTING.md          # Open-source contribution guidelines
├── docker-compose.yml       # Containerized service orchestration
├── yolov8n.pt               # Pretrained lightweight YOLOv8 model weights
├── ai_engine/               # Python AI Inference Service
│   ├── annotator.py         # HUD overlay rendering (Red/Green squares & circles)
│   ├── collision_analyzer.py# Jev Decision Gatekeeper & kinematic physics analysis
│   ├── config.py            # Computer vision and storage path configuration
│   ├── damage_assessment.py # Vehicle damage categorization
│   ├── detector.py          # YOLOv8 + ByteTrack object tracking
│   ├── pedestrian_assessment.py # Casualty triage & injury severity estimation
│   ├── pipeline.py          # End-to-end two-pass video analysis pipeline
│   ├── report_generator.py  # JSON & forensic HTML/PDF report generator
│   ├── service.py           # Internal FastAPI inference server (port 8000)
│   ├── structural_deformation.py # SID-QE Campbell/CRASH3 chassis deformation engine
│   └── tracker.py           # Entity tracking and speed calculation
├── backend/                 # Java Spring Boot 3.4 Backend
│   ├── pom.xml              # Maven dependencies & build configuration
│   └── src/main/java/com/aegisai/
│       ├── AegisaiBackendApplication.java # Spring Boot main entrypoint
│       ├── controller/      # REST API controllers (Videos, Incidents, Reports)
│       ├── model/           # JPA entities & DTO models
│       ├── repository/      # Spring Data JPA repositories
│       └── service/         # Business logic and AI service integration
├── frontend/                # React 18 + Vite + Tailwind CSS Dashboard
│   ├── package.json         # Frontend dependencies and build scripts
│   ├── vite.config.ts       # Vite bundler configuration
│   └── src/
│       ├── App.tsx          # Main application layout and routing
│       ├── components/      # Reusable UI components (Navbar, StatusBadge)
│       ├── pages/           # Operational dashboard pages
│       │   ├── LiveAnalysisPage.tsx     # Synchronized video player & HUD overlay
│       │   ├── EmergencyAlerts.tsx      # Kinematic evidence review queue
│       │   ├── VehicleIntelligence.tsx  # Multi-quadrant car/bike chassis heatmaps
│       │   ├── MedicalDigitalTwin.tsx   # Casualty triage & AIS anatomical twin
│       │   ├── IncidentMap.tsx          # Interactive OpenStreetMap with lane zoom
│       │   └── IncidentReports.tsx      # Forensic report & PDF download
│       └── utils/           # Kinematics and video metadata utilities
├── docs/                    # Technical architecture & demo guides
│   ├── ARCHITECTURE.md      # Deep-dive system design
│   ├── API_DOCUMENTATION.md # OpenAPI specification
│   ├── DEMO_GUIDE.md        # Step-by-step evaluator presentation guide
│   └── KNOWN_LIMITATIONS.md # Edge case handling and documented trade-offs
├── scripts/                 # Automation scripts
│   ├── start.sh             # Autonomous multi-service launcher
│   └── stop.sh              # Clean process termination script
└── storage/                 # Local media and forensic reports directory
    ├── uploads/             # Raw uploaded video files
    ├── processed/           # H.264 annotated video outputs
    ├── reports/             # Generated forensic JSON and HTML reports
    └── thumbnails/          # High-resolution video frame thumbnails
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
