#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

echo "============================================================="
echo "       AEGISAI :: Local Autonomous System Launcher          "
echo "  Artificial Emergency Guidance & Intelligent Surveillance   "
echo "============================================================="

# 1. Start Python AI Engine (FastAPI + YOLO + MPS)
echo "[1/3] Starting Python AI Inference Engine on port 8000 (MPS Accelerated)..."
export PYTHONPATH="$DIR"
python3.13 -m uvicorn ai_engine.service:app --host 0.0.0.0 --port 8000 > "$DIR/storage/ai_engine.log" 2>&1 &
AI_PID=$!
echo $AI_PID > "$DIR/storage/ai_engine.pid"

# Wait for AI service health
echo "      Waiting for AI service health check..."
for i in {1..20}; do
  if curl -s http://localhost:8000/health | grep -q "UP"; then
    echo "      AI Engine is UP on Apple Silicon MPS!"
    break
  fi
  sleep 1
done

# 2. Start Java Spring Boot Application Backend
echo "[2/3] Starting Java Spring Boot Backend on port 8085..."
export JAVA_HOME="/opt/homebrew/Cellar/openjdk/27.0.1.0.3/libexec/openjdk.jdk/Contents/Home"
if [ ! -d "$JAVA_HOME" ]; then
  export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home"
fi

java -Dserver.port=8085 -Dspring.profiles.active=dev -jar "$DIR/backend/target/aegisai-backend-1.0.0.jar" > "$DIR/storage/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$DIR/storage/backend.pid"

echo "      Waiting for Java backend health check..."
for i in {1..30}; do
  if curl -s http://localhost:8085/api/v1/health | grep -q "UP"; then
    echo "      Java Spring Boot Backend is UP and Healthy on port 8085!"
    break
  fi
  sleep 1
done

# 3. Start Frontend Dashboard
echo "[3/3] Starting React Vite Dashboard on port 5173..."
cd "$DIR/frontend"
npx vite --port 5173 --host > "$DIR/storage/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$DIR/storage/frontend.pid"

echo "============================================================="
echo "AEGISAI Command Center is live:"
echo "  -> Operations Dashboard: http://localhost:5173"
echo "  -> Backend Swagger API:  http://localhost:8085/swagger-ui.html"
echo "  -> AI Inference Engine:  http://localhost:8000/docs"
echo "============================================================="
