#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

echo "Stopping AEGISAI Services..."

if [ -f "$DIR/storage/frontend.pid" ]; then
  kill $(cat "$DIR/storage/frontend.pid") 2>/dev/null || true
  rm "$DIR/storage/frontend.pid"
fi

if [ -f "$DIR/storage/backend.pid" ]; then
  kill $(cat "$DIR/storage/backend.pid") 2>/dev/null || true
  rm "$DIR/storage/backend.pid"
fi

if [ -f "$DIR/storage/ai_engine.pid" ]; then
  kill $(cat "$DIR/storage/ai_engine.pid") 2>/dev/null || true
  rm "$DIR/storage/ai_engine.pid"
fi

# Fallback cleanup by ports
pkill -f "uvicorn ai_engine.service:app" 2>/dev/null || true
pkill -f "aegisai-backend-1.0.0.jar" 2>/dev/null || true
pkill -f "vite --port 5173" 2>/dev/null || true

echo "All AEGISAI services stopped successfully."
