import os
import threading
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel

from .config import YOLO_MODEL, DEVICE, AI_SERVICE_PORT
from .pipeline import AnalysisPipeline

app = FastAPI(
    title="AEGISAI AI Inference Service",
    description="Computer Vision & Kinematic Incident Analysis Engine for AEGISAI",
    version="1.0.0"
)

# Shared Pipeline Instance
pipeline = AnalysisPipeline(model_name=YOLO_MODEL, device=DEVICE)

# In-memory Job State Cache
jobs_cache: Dict[str, Dict[str, Any]] = {}

class AnalyzeRequest(BaseModel):
    videoId: str
    videoPath: str
    options: Optional[Dict[str, Any]] = None

@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "AEGISAI-Inference-Engine",
        "device": pipeline.detector.device,
        "model": pipeline.detector.model_name
    }

def run_pipeline_async(video_path: str, video_id: str):
    def update_prog(prog: float):
        if video_id in jobs_cache:
            jobs_cache[video_id]["progress"] = round(prog, 2)
            jobs_cache[video_id]["status"] = "PROCESSING"

    try:
        jobs_cache[video_id] = {
            "status": "PROCESSING",
            "progress": 0.05,
            "error": None,
            "results": None
        }
        results = pipeline.run(video_path=video_path, video_id=video_id, progress_callback=update_prog)
        jobs_cache[video_id]["status"] = "COMPLETED"
        jobs_cache[video_id]["progress"] = 1.0
        jobs_cache[video_id]["results"] = results
    except Exception as e:
        import traceback
        traceback.print_exc()
        jobs_cache[video_id]["status"] = "FAILED"
        jobs_cache[video_id]["error"] = str(e)

@app.post("/analyze")
def analyze(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    if not os.path.exists(req.videoPath):
        raise HTTPException(status_code=404, detail=f"Video file not found at {req.videoPath}")

    jobs_cache[req.videoId] = {
        "status": "QUEUED",
        "progress": 0.0,
        "error": None,
        "results": None
    }
    background_tasks.add_task(run_pipeline_async, req.videoPath, req.videoId)
    return {
        "videoId": req.videoId,
        "status": "QUEUED",
        "message": "Analysis job queued successfully"
    }

@app.get("/jobs/{video_id}/status")
def get_job_status(video_id: str):
    if video_id not in jobs_cache:
        raise HTTPException(status_code=404, detail=f"Job {video_id} not found")
    job = jobs_cache[video_id]
    return {
        "videoId": video_id,
        "status": job["status"],
        "progress": job["progress"],
        "error": job["error"]
    }

@app.get("/jobs/{video_id}/results")
def get_job_results(video_id: str):
    if video_id not in jobs_cache:
        raise HTTPException(status_code=404, detail=f"Job {video_id} not found")
    job = jobs_cache[video_id]
    if job["status"] == "FAILED":
        raise HTTPException(status_code=500, detail=f"Job failed: {job['error']}")
    if job["status"] != "COMPLETED":
        return {
            "videoId": video_id,
            "status": job["status"],
            "progress": job["progress"],
            "results": None
        }
    return job["results"]

if __name__ == "__main__":
    import uvicorn
    print(f"Starting AEGISAI AI Engine on port {AI_SERVICE_PORT}...")
    uvicorn.run("ai_engine.service:app", host="0.0.0.0", port=AI_SERVICE_PORT, reload=False)
