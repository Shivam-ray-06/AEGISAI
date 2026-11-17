# Contributing to AEGISAI

Thank you for your interest in contributing to **AEGISAI** (*Artificial Emergency Guidance & Intelligent Surveillance using AI*)!

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please be respectful, professional, and constructive in all discussions, pull requests, and issue reports.

---

## Architecture Overview

AEGISAI operates as an asynchronous, tri-tier intelligent platform:
1. **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts, Zustand.
2. **Backend**: Java 21, Spring Boot 3.4, Spring Data JPA, Hibernate, PostgreSQL (with automatic H2 development fallback).
3. **AI Inference Service**: Python 3.12/3.13, PyTorch, Ultralytics YOLOv8, ByteTrack, OpenCV, SID-QE Structural Deformation Engine, and the Jev Expert Decision Gatekeeper.

```
React Frontend (Port 5173)
       │
       ▼ (REST API / JSON)
Spring Boot Backend (Port 8085)
       │
       ├──► PostgreSQL (Port 5432)
       ├──► Local Video/Report Storage (storage/)
       └──► Python AI Engine (Port 8000)
```

---

## Development Workflow

### 1. Fork & Clone
```bash
git clone https://github.com/your-username/AEGISAI.git
cd AEGISAI
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Backend Setup (Java 21 + Maven)
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

### 4. AI Engine Setup (Python 3.12+)
```bash
cd ../ai_engine
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn ai_engine.service:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```

---

## Submitting Pull Requests

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Write clean, modular, and self-documenting code following standard naming conventions.
3. Verify all services compile and pass sanity checks:
   - Java: `mvn test` in `backend/`
   - Python: run unit tests and ensure clean type annotations
   - Frontend: `npm run build` or `npx tsc --noEmit`
4. Commit your changes with clear semantic commit messages:
   ```bash
   git commit -m "feat(ai-engine): improve kinematic deceleration threshold in Jev filter"
   ```
5. Push to your fork and submit a Pull Request to `main`.

---

## Reporting Issues

If you discover a bug, performance bottleneck, or edge-case in collision detection:
1. Check the [Issues tab](https://github.com/your-username/AEGISAI/issues) to ensure it hasn't already been reported.
2. Open a new issue including:
   - Detailed description of the problem.
   - Operating system and hardware environment (e.g. macOS Apple Silicon M2, Ubuntu x86_64).
   - Video resolution, frame rate, and input format.
   - Relevant log output from `storage/ai_engine.log` or `storage/backend.log`.
