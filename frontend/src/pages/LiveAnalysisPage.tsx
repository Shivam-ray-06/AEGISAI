import React, { useState, useRef } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Film,
  ShieldAlert,
  Car,
  Users,
  Eye,
  Info,
  Clock,
  Volume2,
  VolumeX,
  Gauge,
  Sliders,
  Maximize,
  FastForward,
  Rewind
} from 'lucide-react';
import { VideoJob, Incident, VehicleAssessment, PedestrianAssessment } from '../types';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';

interface LiveAnalysisPageProps {
  videos: VideoJob[];
  selectedVideoId: string | null;
  onSelectVideo: (id: string) => void;
  incidents: Incident[];
  vehicles: VehicleAssessment[];
  pedestrians: PedestrianAssessment[];
  onNavigateToReports: () => void;
}

export const LiveAnalysisPage: React.FC<LiveAnalysisPageProps> = ({
  videos,
  selectedVideoId,
  onSelectVideo,
  incidents,
  vehicles,
  pedestrians,
  onNavigateToReports,
}) => {
  const [viewMode, setViewMode] = useState<'annotated' | 'original' | 'split'>('annotated');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = videos.find(v => v.videoId === selectedVideoId) || videos[0];

  const videoIncidents = incidents.filter(i => i.videoJob?.videoId === activeVideo?.videoId);
  const videoVehicles = vehicles.filter(v => v.videoJob?.videoId === activeVideo?.videoId);
  const videoPedestrians = pedestrians.filter(p => p.videoJob?.videoId === activeVideo?.videoId);

  const jumpToTime = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, timestamp - 1.5); // Jump 1.5s before incident
      videoRef.current.play();
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Video Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>AI Neural Video Intelligence & Kinematic Inspection</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Frame-accurate persistent tracking, tactical Red & Blue overlays, and interactive scrubbing.
          </p>
        </div>

        {/* Video Dropdown Selector */}
        {videos.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Feed:</span>
            <select
              value={activeVideo?.videoId || ''}
              onChange={(e) => onSelectVideo(e.target.value)}
              className="bg-[#121824] border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400 font-mono shadow-sm"
            >
              {videos.map(v => (
                <option key={v.videoId} value={v.videoId}>
                  {v.videoId} — {v.originalFilename} ({v.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!activeVideo ? (
        <div className="p-12 text-center rounded-2xl bg-[#121824] border border-slate-800 text-slate-400 text-xs">
          No processed surveillance videos found. Go to Video Upload to analyze a feed.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Video View & View Mode Switcher */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono text-cyan-400 font-extrabold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {activeVideo.videoId}
                </span>
                <span className="text-slate-300 font-medium">{activeVideo.originalFilename}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">{activeVideo.resolution} @ {activeVideo.fps?.toFixed(0)} FPS</span>
              </div>

              {/* View Mode & Speed Toggles */}
              <div className="flex items-center space-x-3 text-xs">
                {/* Playback Speed */}
                <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                  {[0.5, 1.0, 1.5].map(spd => (
                    <button
                      key={spd}
                      onClick={() => changeSpeed(spd)}
                      className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] transition-all ${
                        playbackSpeed === spd ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* View Mode */}
                <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800">
                  <button
                    onClick={() => setViewMode('annotated')}
                    className={`px-3 py-1 rounded font-semibold transition-all ${
                      viewMode === 'annotated' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Annotated View
                  </button>
                  <button
                    onClick={() => setViewMode('original')}
                    className={`px-3 py-1 rounded font-semibold transition-all ${
                      viewMode === 'original' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Original Video
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className={`px-3 py-1 rounded font-semibold transition-all ${
                      viewMode === 'split' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Side-by-Side
                  </button>
                </div>
              </div>
            </div>

            {/* Video Player Display */}
            {viewMode === 'split' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Film className="w-3.5 h-3.5" />
                    <span>Original Surveillance Source</span>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video shadow-xl">
                    <video
                      src={api.getPreviewVideoUrl(activeVideo.videoId)}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Tactical AI Detection (Red/Blue Squares & Circles)</span>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-black border border-cyan-500/30 aspect-video shadow-xl">
                    <video
                      ref={videoRef}
                      src={api.getAnnotatedVideoUrl(activeVideo.videoId)}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative aspect-video max-h-[580px] mx-auto flex items-center justify-center">
                <video
                  ref={videoRef}
                  key={`${activeVideo.videoId}-${viewMode}`}
                  src={viewMode === 'annotated' 
                    ? api.getAnnotatedVideoUrl(activeVideo.videoId) 
                    : api.getPreviewVideoUrl(activeVideo.videoId)}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Interactive Timeline Event Jump Strip */}
            {videoIncidents.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#121824]/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white uppercase text-[11px]">Accident Event Markers:</span>
                  <div className="flex flex-wrap gap-2">
                    {videoIncidents.map(inc => (
                      <button
                        key={inc.incidentId}
                        onClick={() => jumpToTime(inc.eventTimestamp)}
                        className="px-2.5 py-1 rounded-md bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-[11px] font-bold flex items-center space-x-1.5 transition-all shadow-sm shadow-red-950"
                      >
                        <ShieldAlert className="w-3 h-3 text-red-400" />
                        <span>Jump to T+{inc.eventTimestamp}s ({inc.incidentId})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Tip: Click any marker to scrub directly to the collision impact point.
                </div>
              </div>
            )}

            {/* Legend Overlay (Red & Green Squares & Circles) */}
            <div className="p-3.5 rounded-xl bg-[#121824]/90 border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-slate-400 font-bold uppercase text-[11px]">HUD Tactical Overlay Legend:</span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 bg-red-500 rounded-sm" />
                  <span className="text-slate-200 font-bold">RED SQUARE: Collided Vehicle</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 bg-emerald-500 rounded-sm" />
                  <span className="text-slate-200 font-medium">GREEN SQUARE: Safe Traffic Car (Not Hurt)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 bg-red-500 rounded-full" />
                  <span className="text-slate-200 font-bold">RED CIRCLE: Person in Accident</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full" />
                  <span className="text-slate-200 font-medium">GREEN CIRCLE: Safe Pedestrian (Bystander)</span>
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Classification: <strong>AI & Expert Decision Engine</strong>
              </div>
            </div>
          </div>

          {/* Telemetry Tabs: Incidents, Tracked Vehicles, Pedestrians */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Candidate Incidents */}
            <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Collision Candidates</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-950 text-red-400 border border-red-800/40">
                  {videoIncidents.length} Detected
                </span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {videoIncidents.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No collision candidates flagged.</p>
                ) : (
                  videoIncidents.map(inc => (
                    <div
                      key={inc.incidentId}
                      onClick={() => jumpToTime(inc.eventTimestamp)}
                      className="p-3.5 rounded-lg bg-[#0E1420] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                          {inc.incidentId}
                        </span>
                        <StatusBadge status={inc.reviewStatus} />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{inc.eventDescription}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span>Click to jump: <strong className="text-cyan-300">T+{inc.eventTimestamp}s</strong></span>
                        <span className="text-emerald-400 font-semibold">{(inc.confidenceScore * 100).toFixed(0)}% Conf</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. Tracked Vehicles */}
            <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Car className="w-4 h-4 text-cyan-400" />
                  <span>Vehicle Intelligence</span>
                </h3>
                <span className="text-xs text-slate-400">{videoVehicles.length} vehicles</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {videoVehicles.slice(0, 12).map(v => (
                  <div
                    key={v.id}
                    onClick={() => jumpToTime(v.eventTimestamp)}
                    className="p-2.5 rounded-lg bg-[#0E1420] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-cyan-300 mr-2">{v.vehicleId}</span>
                      <span className="text-slate-300">[{v.vehicleType}]</span>
                    </div>
                    {v.collisionInvolvement ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800/40">
                        INVOLVED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-950/60 text-blue-400 border border-blue-800/40">
                        NORMAL
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Tracked Pedestrians */}
            <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Pedestrian Intelligence</span>
                </h3>
                <span className="text-xs text-slate-400">{videoPedestrians.length} tracked</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {videoPedestrians.slice(0, 12).map(p => (
                  <div
                    key={p.id}
                    onClick={() => jumpToTime(p.eventTimestamp)}
                    className="p-2.5 rounded-lg bg-[#0E1420] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-300 mr-2">{p.personId}</span>
                      <span className="text-slate-300">{p.movementStatus}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.warningLevel === 'RED'
                        ? 'bg-red-950 text-red-400 border border-red-800/40'
                        : p.warningLevel === 'AMBER'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                          : 'bg-blue-950 text-blue-400 border border-blue-800/40'
                    }`}>
                      {p.warningLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
