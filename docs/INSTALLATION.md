# AEGISAI — Installation & Local Setup Guide

## System Requirements
- **Hardware**: MacBook Air M2 (or any Apple Silicon / Intel Mac with 16GB RAM)
- **OS**: macOS Sonoma or later
- **Runtimes**:
  - Python 3.12 / 3.13 / 3.14
  - Java 21+ (OpenJDK 21, 25, or 27)
  - Node.js v20+ & npm
  - Maven 3.9+
  - FFmpeg (with libx264 support)

---

## One-Click Setup & Execution

### 1. Start All Services
```bash
cd /Volumes/Krishu/AEGISAI
./scripts/start.sh
```
This automatically boots:
- Python AI Inference Service on `http://localhost:8000` (PyTorch MPS)
- Java Spring Boot Backend on `http://localhost:8085`
- React Vite Dashboard on `http://localhost:5173`

### 2. Stop All Services
```bash
./scripts/stop.sh
```

---

## Manual Execution (Independent Run)

### Backend (Java Spring Boot)
```bash
cd /Volumes/Krishu/AEGISAI/backend
/opt/homebrew/bin/mvn clean package -DskipTests
java -Dserver.port=8085 -Dspring.profiles.active=dev -jar target/aegisai-backend-1.0.0.jar
```

### AI Inference Engine (Python)
```bash
cd /Volumes/Krishu/AEGISAI
export PYTHONPATH=.
python3.13 -m uvicorn ai_engine.service:app --host 0.0.0.0 --port 8000
```

### Frontend (React + Vite)
```bash
cd /Volumes/Krishu/AEGISAI/frontend
npm run dev -- --port 5173
```

---

## Docker Compose Execution
To run with PostgreSQL and containerized services:
```bash
docker compose up --build
```
*(Note: Python inference is recommended to run natively on macOS to leverage Apple Silicon MPS hardware acceleration).*
