import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Play,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Download,
  Loader2,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../api/client';
import { VideoJob, JobStatus } from '../types';

interface VideoUploadPageProps {
  onAnalysisStarted: (videoId: string) => void;
  onRefreshVideos: () => void;
}

export const VideoUploadPage: React.FC<VideoUploadPageProps> = ({
  onAnalysisStarted,
  onRefreshVideos,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeJob, setActiveJob] = useState<VideoJob | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      selectFile(e.target.files[0]);
    }
  };

  const selectFile = (f: File) => {
    const validExtensions = ['.mp4', '.mov', '.avi'];
    const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(ext)) {
      setError(`Unsupported file format (${ext}). Please select an MP4, MOV, or AVI video.`);
      return;
    }
    setError(null);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setActiveJob(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(10);

      const uploadRes = await api.uploadVideo(file, (percent) => {
        setUploadProgress(percent);
      });

      const videoId = uploadRes.videoId;
      setUploading(false);
      setAnalysisStatus('QUEUED');
      setAnalysisProgress(5);

      // Start asynchronous AI inference
      await api.startAnalysis(videoId);
      onAnalysisStarted(videoId);

      // Poll status
      pollStatus(videoId);
    } catch (err: any) {
      setUploading(false);
      setError(err.response?.data?.message || err.message || 'Upload failed');
    }
  };

  const pollStatus = (videoId: string) => {
    const interval = setInterval(async () => {
      try {
        const statusRes = await api.getVideoStatus(videoId);
        setAnalysisStatus(statusRes.status);
        setAnalysisProgress(Math.round((statusRes.progress || 0) * 100));

        if (statusRes.status === 'COMPLETED') {
          clearInterval(interval);
          const fullJob = await api.getVideoById(videoId);
          setActiveJob(fullJob);
          onRefreshVideos();
        } else if (statusRes.status === 'FAILED') {
          clearInterval(interval);
          setError(statusRes.errorMessage || 'Analysis failed in AI engine.');
        }
      } catch (e) {
        clearInterval(interval);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
          <UploadCloud className="w-5 h-5 text-cyan-400" />
          <span>Surveillance Video Ingestion & Processing</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload CCTV or dashcam footage. The AI engine applies YOLO detection, ByteTrack tracking, multi-signal collision analysis, and generates annotated intelligence.
        </p>
      </div>

      {/* Grid: Upload & Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Drag & Drop Zone and Player */}
        <div className="lg:col-span-2 space-y-4">
          {!previewUrl && !activeJob ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-12 text-center bg-[#121824]/60 hover:bg-[#121824] transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Drag & drop surveillance video here</p>
                <p className="text-xs text-slate-400">Supports MP4, MOV, and AVI up to 200MB</p>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
              >
                Browse Files
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video Player Display */}
              <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative aspect-video flex items-center justify-center">
                {activeJob?.annotatedVideoPath ? (
                  <video
                    src={api.getAnnotatedVideoUrl(activeJob.videoId)}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : previewUrl ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : null}

                {/* Processing Overlay if currently in inference */}
                {analysisStatus === 'PROCESSING' && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 text-center p-6 z-10">
                    <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white tracking-wide">
                        AI Neural Inference in Progress
                      </p>
                      <p className="text-xs text-slate-300">
                        Running YOLOv8 & ByteTrack tracking on Apple Silicon MPS...
                      </p>
                    </div>
                    <div className="w-64 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="bg-cyan-400 h-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      {analysisProgress}% Complete
                    </span>
                  </div>
                )}
              </div>

              {/* Reset or Change File */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {file?.name || activeJob?.originalFilename} ({((file?.size || activeJob?.fileSizeBytes || 0) / (1024 * 1024)).toFixed(2)} MB)
                </span>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setActiveJob(null);
                    setAnalysisStatus(null);
                  }}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Upload Another Video
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right 1 Col: Video Specs, Controls, and Preloaded Samples */}
        <div className="space-y-4">
          {/* Action Card */}
          <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Configuration</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Inference Device</span>
                <span className="font-semibold text-emerald-400">Apple Silicon MPS</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Object Detector</span>
                <span className="font-semibold text-cyan-400">Ultralytics YOLOv8</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Tracker</span>
                <span className="font-semibold text-slate-200">ByteTrack (Persisted IDs)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Analysis Engine</span>
                <span className="font-semibold text-slate-200">Multi-Signal Temporal</span>
              </div>
            </div>

            {file && !activeJob && (
              <button
                disabled={uploading || analysisStatus === 'PROCESSING'}
                onClick={handleUploadAndAnalyze}
                className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading ({uploadProgress}%)...</span>
                  </>
                ) : analysisStatus === 'PROCESSING' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Analysis</span>
                  </>
                )}
              </button>
            )}

            {activeJob && activeJob.status === 'COMPLETED' && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Analysis complete! Video annotated and indexed.</span>
                </div>
                <a
                  href={api.getAnnotatedVideoUrl(activeJob.videoId)}
                  download={`${activeJob.videoId}_annotated.mp4`}
                  className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center space-x-2 transition-all block text-center"
                >
                  <Download className="w-3.5 h-3.5 inline mr-1" />
                  <span>Download Annotated Video</span>
                </a>
              </div>
            )}
          </div>

          {/* Quick Pre-Loaded Test Videos with 1-Click Launch */}
          <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>1-Click Test Accident Videos</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Select any pre-configured accident case study to load and analyze instantly:
            </p>

            <div className="space-y-2">
              <div 
                onClick={async () => {
                  try {
                    setUploading(true);
                    setError(null);
                    // Fetch existing local test video via blob
                    const response = await fetch('/api/v1/videos');
                    const vids = await response.json();
                    if (vids.data && vids.data.length > 0) {
                      setActiveJob(vids.data[0]);
                      onAnalysisStarted(vids.data[0].videoId);
                    }
                    setUploading(false);
                  } catch (e: any) {
                    setUploading(false);
                  }
                }}
                className="p-3 rounded-lg bg-[#0E1420] hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer text-xs flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-white group-hover:text-cyan-300">Case Study 1: accident_vid_1.mp4</p>
                  <p className="text-[10px] text-slate-400">816x464 | 60 fps | 23.5s | Intersection Collision</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  Load & View
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0E1420] border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-300">Case Study 2: accident_vid_2.mp4</p>
                  <p className="text-[10px] text-slate-500">478x850 | 30 fps | 64.0s | Surveillance Feed</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                  Available
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0E1420] border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-300">Case Study 3: accident_vid_3.mp4</p>
                  <p className="text-[10px] text-slate-500">720x1282 | 30 fps | 24.3s | Highway Queue</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
