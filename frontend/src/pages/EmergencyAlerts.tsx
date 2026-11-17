import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  Car,
  Users,
  Video,
  Activity,
  Zap,
  Layers,
  AlertTriangle,
  Compass,
  ChevronDown,
  ChevronUp,
  Info,
  PlayCircle
} from 'lucide-react';
import { Incident, IncidentStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../api/client';
import { parseVideoMeta } from '../utils/videoMeta';
import { analyzeKinematics } from '../utils/kinematicAnalyzer';

interface EmergencyAlertsProps {
  incidents: Incident[];
  onUpdateStatus: (incidentId: string, newStatus: IncidentStatus) => void;
  onSelectIncident: (inc: Incident) => void;
}

export const EmergencyAlerts: React.FC<EmergencyAlertsProps> = ({
  incidents,
  onUpdateStatus,
  onSelectIncident,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterVideo, setFilterVideo] = useState<string>('ALL');
  const [expandedTelemetry, setExpandedTelemetry] = useState<Record<string, boolean>>({});

  const toggleTelemetry = (incidentId: string) => {
    setExpandedTelemetry(prev => ({
      ...prev,
      [incidentId]: !prev[incidentId],
    }));
  };

  const handleStatusChange = async (incidentId: string, status: IncidentStatus) => {
    try {
      await api.updateIncidentStatus(incidentId, status);
      onUpdateStatus(incidentId, status);
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  // Counts by video
  const vid1Count = incidents.filter(i => parseVideoMeta(i.videoJob?.originalFilename, i.videoJob?.videoId).id === 'VID_1').length;
  const vid2Count = incidents.filter(i => parseVideoMeta(i.videoJob?.originalFilename, i.videoJob?.videoId).id === 'VID_2').length;
  const vid3Count = incidents.filter(i => parseVideoMeta(i.videoJob?.originalFilename, i.videoJob?.videoId).id === 'VID_3').length;

  const filtered = incidents.filter(i => {
    if (filterStatus !== 'ALL' && i.reviewStatus !== filterStatus) return false;
    if (filterVideo !== 'ALL') {
      const vMeta = parseVideoMeta(i.videoJob?.originalFilename, i.videoJob?.videoId);
      if (vMeta.id !== filterVideo) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <span>Emergency Incident Verification & Kinematic Evidence Hub</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Forensic review queue with explainable kinematic anomaly analysis across uploaded CCTV & dashcam videos (Video 1, Video 2, Video 3). Certified operators decide emergency triage actions.
        </p>
      </div>

      {/* Dual Filter Controls: Video Origin + Verification Status */}
      <div className="space-y-3 bg-[#121824]/90 p-4 rounded-xl border border-slate-800 text-xs shadow-md">
        {/* Row 1: Source Video Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">Footage Source:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterVideo('ALL')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                filterVideo === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white'
              }`}
            >
              All Footage ({incidents.length})
            </button>
            <button
              onClick={() => setFilterVideo('VID_1')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
                filterVideo === 'VID_1'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                  : 'bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-950/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Video 1: Dashcam Impact ({vid1Count})</span>
            </button>
            <button
              onClick={() => setFilterVideo('VID_2')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
                filterVideo === 'VID_2'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'bg-amber-950/40 text-amber-300 border border-amber-800/40 hover:bg-amber-950/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Video 2: Urban Corridor ({vid2Count})</span>
            </button>
            <button
              onClick={() => setFilterVideo('VID_3')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center space-x-1.5 transition-all ${
                filterVideo === 'VID_3'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/30'
                  : 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-950/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Video 3: Crosswalk & Traffic ({vid3Count})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Verification Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-semibold uppercase text-[11px]">Status Filter:</span>
            {(['ALL', 'PENDING_VERIFICATION', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'RESOLVED'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  filterStatus === s ? 'bg-slate-200 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <span className="text-slate-400 font-mono text-xs font-semibold">{filtered.length} incident candidate(s)</span>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#121824] border border-slate-800 text-slate-400 text-xs space-y-2">
            <Info className="w-8 h-8 mx-auto text-slate-500" />
            <p className="font-semibold text-slate-300">No incident alerts found for the selected video and status filter.</p>
            <p className="text-slate-500 text-[11px]">Try switching the footage source filter above to "All Footage".</p>
          </div>
        ) : (
          filtered.map(inc => {
            const videoMeta = parseVideoMeta(inc.videoJob?.originalFilename, inc.videoJob?.videoId);

            let parsedVehicles: string[] = [];
            let parsedPedestrians: string[] = [];
            let parsedEvidence: string[] = [];
            try {
              parsedVehicles = JSON.parse(inc.involvedVehicles || '[]');
              parsedPedestrians = JSON.parse(inc.nearbyPedestrians || '[]');
              parsedEvidence = JSON.parse(inc.evidenceDetected || '[]');
            } catch (e) {
              parsedVehicles = [inc.involvedVehicles];
            }

            // Kinematic physics engine evaluation
            const profile = analyzeKinematics(
              parsedEvidence,
              inc.eventTimestamp,
              parsedVehicles,
              parsedPedestrians,
              videoMeta
            );

            const isExpanded = !!expandedTelemetry[inc.incidentId];

            return (
              <div
                key={inc.incidentId}
                className={`rounded-2xl bg-[#121824]/95 border ${videoMeta.borderClass} hover:border-slate-600 transition-all space-y-4 shadow-xl overflow-hidden`}
              >
                {/* 1. Prominent Video Origin Banner */}
                <div className={`p-4 border-b border-slate-800/80 bg-gradient-to-r ${videoMeta.badgeClass} flex flex-col md:flex-row md:items-center justify-between gap-3`}>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-black tracking-wider uppercase ${videoMeta.pillClass} shadow-md`}>
                      {videoMeta.shortTag}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>{videoMeta.scenarioTitle}</span>
                        <span className={`w-2 h-2 rounded-full ${videoMeta.dotColor}`} />
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 mt-0.5 font-mono">
                        <span>File: <strong className="text-white">{inc.videoJob?.originalFilename || 'video.mp4'}</strong></span>
                        <span>•</span>
                        <span>Spec: {inc.videoJob?.resolution || 'HD'} @ {inc.videoJob?.fps?.toFixed(0) || 30} FPS</span>
                        <span>•</span>
                        <span>Duration: {inc.videoJob?.durationSeconds?.toFixed(1) || '--'}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded border text-[11px] font-bold ${profile.severityColor} uppercase tracking-wider flex items-center space-x-1`}>
                      <Activity className="w-3.5 h-3.5" />
                      <span>{profile.severity} ANOMALY</span>
                    </span>
                    <button
                      onClick={() => onSelectIncident(inc)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-500/20"
                      title="Inspect video in Live Player"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Play at T+{inc.eventTimestamp}s</span>
                    </button>
                  </div>
                </div>

                {/* 2. Incident Summary Header */}
                <div className="px-5 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-base font-extrabold text-cyan-400">{inc.incidentId}</span>
                    <StatusBadge status={inc.reviewStatus} />
                    <span className="text-xs text-slate-300 flex items-center space-x-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Impact Timestamp: <strong>T+{inc.eventTimestamp}s</strong></span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-semibold text-emerald-400">
                      {(inc.confidenceScore * 100).toFixed(0)}% Multi-Signal Confidence
                    </span>
                    <a
                      href={api.getReportDownloadUrl(inc.incidentId)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Dossier</span>
                    </a>
                  </div>
                </div>

                {/* 3. Narrative Description & Involved Entities */}
                <div className="px-5 space-y-3">
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {inc.eventDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Tracked Entities:</span>
                    {parsedVehicles.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/40 flex items-center space-x-1">
                        <Car className="w-3 h-3 inline mr-1 text-cyan-400" />
                        <span>{v}</span>
                      </span>
                    ))}
                    {parsedPedestrians.map((p, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950 text-amber-300 border border-amber-800/40 flex items-center space-x-1">
                        <Users className="w-3 h-3 inline mr-1 text-amber-400" />
                        <span>{p}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. EXPLAINABLE KINEMATIC FORENSIC SYNTHESIS BOX */}
                <div className="px-5">
                  <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-900/50 space-y-2.5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-amber-500 to-red-500" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                        <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span>Forensic Kinematic Explainability Breakdown ({videoMeta.displayName})</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        Newtonian Dynamics Engine
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {profile.plainEnglishExplanation}
                    </p>
                  </div>
                </div>

                {/* 5. 4-PILLAR KINEMATIC EVIDENCE METRICS GRID */}
                <div className="px-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Pillar 1: Deceleration & Δv */}
                    <div className="p-3.5 rounded-xl bg-[#0E1420] border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold flex items-center space-x-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Deceleration (Δv)</span>
                        </span>
                        <span className="font-mono text-xs font-black text-amber-400">
                          {profile.physicsBreakdown.decelStatus}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${Math.min(100, (Math.abs(profile.maxDeceleration || 0) / 180) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {profile.physicsBreakdown.decelInterpretation}
                      </p>
                    </div>

                    {/* Pillar 2: Spatial Hull Overlap (IoU) */}
                    <div className="p-3.5 rounded-xl bg-[#0E1420] border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold flex items-center space-x-1">
                          <Layers className="w-3.5 h-3.5 text-red-400" />
                          <span>Spatial Overlap (IoU)</span>
                        </span>
                        <span className="font-mono text-xs font-black text-red-400">
                          {profile.physicsBreakdown.overlapStatus}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-red-400 h-full rounded-full"
                          style={{ width: `${Math.min(100, ((profile.maxIoU || 0) / 0.5) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {profile.physicsBreakdown.overlapInterpretation}
                      </p>
                    </div>

                    {/* Pillar 3: Centroid Proximity Collapse */}
                    <div className="p-3.5 rounded-xl bg-[#0E1420] border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Proximity Buffer</span>
                        </span>
                        <span className="font-mono text-xs font-black text-cyan-400">
                          {profile.physicsBreakdown.proximityStatus}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full"
                          style={{ width: `${Math.max(15, 100 - (profile.minProximity || 80))}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {profile.physicsBreakdown.proximityInterpretation}
                      </p>
                    </div>

                    {/* Pillar 4: Post-Impact Motion Cessation */}
                    <div className="p-3.5 rounded-xl bg-[#0E1420] border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold flex items-center space-x-1">
                          <Compass className="w-3.5 h-3.5 text-rose-400" />
                          <span>Motion Cessation</span>
                        </span>
                        <span className={`font-mono text-xs font-black ${profile.hasMotionCessation ? 'text-rose-400' : 'text-slate-400'}`}>
                          {profile.physicsBreakdown.cessationStatus}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`${profile.hasMotionCessation ? 'bg-rose-500' : 'bg-slate-600'} h-full rounded-full`}
                          style={{ width: profile.hasMotionCessation ? '100%' : '20%' }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {profile.physicsBreakdown.cessationInterpretation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. EXPANDABLE RAW SENSOR TELEMETRY LOG */}
                <div className="px-5">
                  <button
                    onClick={() => toggleTelemetry(inc.incidentId)}
                    className="w-full py-2 px-3 rounded-lg bg-[#0E1420] hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center space-x-2">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Raw Kinematic Sensor Feed ({parsedEvidence.length} detection pulses recorded for {videoMeta.displayName})</span>
                    </span>
                    <span className="flex items-center space-x-1 text-[11px] text-cyan-400">
                      <span>{isExpanded ? 'Hide Raw Stream' : 'Expand Raw Telemetry'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3.5 rounded-xl bg-[#0B0F17] border border-slate-800/80 max-h-56 overflow-y-auto space-y-1.5">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
                        Sensor Frame Detections Log (ByteTrack + Optical Flow + Spatial Matrix):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedEvidence.map((ev, i) => {
                          const evLower = ev.toLowerCase();
                          let tagStyle = 'bg-slate-900 text-slate-300 border-slate-800';
                          if (evLower.includes('deceleration')) tagStyle = 'bg-amber-950/40 text-amber-300 border-amber-800/40';
                          if (evLower.includes('overlap') || evLower.includes('iou')) tagStyle = 'bg-red-950/40 text-red-300 border-red-800/40';
                          if (evLower.includes('proximity')) tagStyle = 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40';
                          if (evLower.includes('cessation') || evLower.includes('stationary')) tagStyle = 'bg-rose-950/40 text-rose-300 border-rose-800/40';

                          return (
                            <span key={i} className={`px-2 py-1 rounded text-[10px] font-mono border ${tagStyle}`}>
                              • {ev}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Operator Human-In-The-Loop Verification Workflow */}
                <div className="p-4 bg-[#0E1420]/70 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[11px] font-semibold uppercase">Human Verification Workflow:</span>
                    <span className="text-slate-500 text-[11px]">({videoMeta.shortTag} incident review)</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(inc.incidentId, 'UNDER_REVIEW')}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition-all border border-slate-700"
                    >
                      Mark Under Review
                    </button>
                    <button
                      onClick={() => handleStatusChange(inc.incidentId, 'VERIFIED')}
                      className="px-3 py-1.5 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verify Accident</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(inc.incidentId, 'REJECTED')}
                      className="px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Candidate</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(inc.incidentId, 'RESOLVED')}
                      className="px-3 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 border border-cyan-500/40 text-xs font-bold transition-all"
                    >
                      Resolve Incident
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
