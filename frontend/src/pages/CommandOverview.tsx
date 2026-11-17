import React from 'react';
import {
  Car,
  Users,
  AlertOctagon,
  ShieldAlert,
  Video,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { VideoJob, Incident, VehicleAssessment, PedestrianAssessment } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { parseVideoMeta } from '../utils/videoMeta';

interface CommandOverviewProps {
  videos: VideoJob[];
  incidents: Incident[];
  vehicles: VehicleAssessment[];
  pedestrians: PedestrianAssessment[];
  onNavigate: (tab: string) => void;
  onSelectIncident: (inc: Incident) => void;
}

export const CommandOverview: React.FC<CommandOverviewProps> = ({
  videos,
  incidents,
  vehicles,
  pedestrians,
  onNavigate,
  onSelectIncident,
}) => {
  const pendingCount = incidents.filter(i => i.reviewStatus === 'PENDING_VERIFICATION' || i.reviewStatus === 'UNDER_REVIEW').length;
  const verifiedCount = incidents.filter(i => i.reviewStatus === 'VERIFIED').length;
  const involvedVehiclesCount = vehicles.filter(v => v.collisionInvolvement).length;

  // Chart data: detection distribution across frames
  const chartData = [
    { time: '00:00', detections: 14, proximityEvents: 0 },
    { time: '00:04', detections: 22, proximityEvents: 1 },
    { time: '00:08', detections: 35, proximityEvents: 3 },
    { time: '00:12', detections: 48, proximityEvents: 7 },
    { time: '00:16', detections: 42, proximityEvents: 5 },
    { time: '00:20', detections: 30, proximityEvents: 2 },
    { time: '00:24', detections: 18, proximityEvents: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Mission Statement */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#121B2A] to-[#0A101D] border border-cyan-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                AEGISAI v1.0
              </span>
              <span className="text-xs text-slate-400">Autonomous Incident Intelligence Platform</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Emergency Guidance & Accident Intelligence Command
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time video surveillance analysis, vehicle & pedestrian tracking, multi-signal collision candidate detection, and emergency medical triage support running locally on Apple Silicon MPS.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Video className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
            <button
              onClick={() => onNavigate('live')}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center space-x-2 transition-all"
            >
              <span>Live Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Videos Processed"
          value={videos.length}
          subtitle={`${videos.filter(v => v.status === 'COMPLETED').length} analysis completed`}
          icon={<Video className="w-5 h-5" />}
          variant="cyan"
        />
        <StatCard
          title="Vehicles Tracked"
          value={vehicles.length}
          subtitle={`${involvedVehiclesCount} collision flagged`}
          icon={<Car className="w-5 h-5" />}
          variant="green"
        />
        <StatCard
          title="Pedestrians Tracked"
          value={pedestrians.length}
          subtitle={`${pedestrians.filter(p => p.warningLevel === 'RED' || p.warningLevel === 'AMBER').length} in perimeter zone`}
          icon={<Users className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="Suspected Incidents"
          value={incidents.length}
          subtitle={`${pendingCount} awaiting human verification`}
          icon={<AlertOctagon className="w-5 h-5" />}
          variant="red"
        />
      </div>

      {/* Main Content Split: Chart & Incidents Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Telemetry Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">Surveillance Kinematics & Detection Telemetry</h2>
              <p className="text-xs text-slate-400">Object density and spatial convergence trajectory across surveillance timeline</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <span className="flex items-center space-x-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Tracked Objects</span>
              </span>
              <span className="flex items-center space-x-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span>Proximity Convergence</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D2FF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="detections" stroke="#00D2FF" strokeWidth={2} fillOpacity={1} fill="url(#cyanGrad)" />
                <Area type="monotone" dataKey="proximityEvents" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#redGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Recent Incident Candidates */}
        <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Incident Candidates</span>
            </h2>
            <span className="text-xs text-slate-400">{incidents.length} total</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-72 pr-1">
            {incidents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No incidents detected yet. Upload a video to begin analysis.
              </div>
            ) : (
              incidents.slice(0, 5).map((inc) => {
                const vMeta = parseVideoMeta(inc.videoJob?.originalFilename, inc.videoJob?.videoId);
                return (
                  <div
                    key={inc.incidentId}
                    onClick={() => onSelectIncident(inc)}
                    className="p-3.5 rounded-lg bg-[#0E1420] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                          {inc.incidentId}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${vMeta.badgeClass}`}>
                          {vMeta.shortTag}
                        </span>
                      </div>
                      <StatusBadge status={inc.reviewStatus} />
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {inc.eventDescription}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>T+{inc.eventTimestamp}s</span>
                      </span>
                      <span className="font-semibold text-emerald-400">
                        {(inc.confidenceScore * 100).toFixed(0)}% Conf
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => onNavigate('alerts')}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium text-center transition-all"
          >
            View All Incident Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
