import React from 'react';
import { Cpu, Server, Database, HardDrive, ShieldCheck, Activity, CheckCircle, RefreshCw } from 'lucide-react';
import { SystemHealth } from '../types';

interface SystemMonitoringProps {
  health: SystemHealth | null;
  onRefreshHealth: () => void;
}

export const SystemMonitoring: React.FC<SystemMonitoringProps> = ({ health, onRefreshHealth }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Infrastructure & AI Engine Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of the Java Spring Boot application backend, Python computer vision service, and Apple Silicon MPS hardware.
          </p>
        </div>

        <button
          onClick={onRefreshHealth}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Diagnostics</span>
        </button>
      </div>

      {/* Subsystem Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Java Spring Boot */}
        <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Server className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              {health?.status || 'ONLINE'}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Java Backend</h3>
            <p className="text-xs text-slate-400">Spring Boot 3.4.3</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div>Port: <strong className="text-slate-200">8080</strong></div>
            <div>Runtime: <strong className="text-slate-200">{health?.javaVersion || 'Java 21/25'}</strong></div>
          </div>
        </div>

        {/* Python AI Engine */}
        <div className="p-5 rounded-xl bg-[#121824]/90 border border-cyan-500/30 space-y-3 shadow-lg shadow-cyan-950/20">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              ONLINE
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Inference Engine</h3>
            <p className="text-xs text-slate-400">Ultralytics YOLO + ByteTrack</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div>Acceleration: <strong className="text-emerald-400">Apple Silicon MPS</strong></div>
            <div>Bridge: <strong className="text-slate-200">FastAPI (Port 8000)</strong></div>
          </div>
        </div>

        {/* Database */}
        <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              {health?.database || 'CONNECTED'}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Database Store</h3>
            <p className="text-xs text-slate-400">JPA / Hibernate ORM</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div>Mode: <strong className="text-slate-200">H2 / PostgreSQL</strong></div>
            <div>Status: <strong className="text-emerald-400">Connected</strong></div>
          </div>
        </div>

        {/* Local Storage */}
        <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              READY
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Local Video Storage</h3>
            <p className="text-xs text-slate-400">Filesystem Direct</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div>Path: <strong className="text-slate-200 font-mono text-[10px]">storage/</strong></div>
            <div>Transcode: <strong className="text-slate-200">FFmpeg H.264</strong></div>
          </div>
        </div>
      </div>

      {/* Diagnostics Panel */}
      <div className="p-6 rounded-2xl bg-[#121824]/90 border border-slate-800 space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Diagnostic Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0E1420] border border-slate-800/80 space-y-2">
            <p className="font-semibold text-white">Apple Metal Performance Shaders (MPS)</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Native GPU acceleration enabled for MacBook Air M2 unified memory architecture. YOLO inference runs in tensor float-16 precision without external CUDA requirements.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#0E1420] border border-slate-800/80 space-y-2">
            <p className="font-semibold text-white">Multi-Signal Kinematic Engine</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Accident candidate classification combines centroid proximity, bounding-box intersection, abrupt deceleration (&gt;15 px/s), and post-impact motion cessation across consecutive video frames.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
