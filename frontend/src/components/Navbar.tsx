import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  ShieldAlert,
  Wifi,
  Clock,
  Database,
  Radio,
  Bell,
  ChevronRight,
  CheckCircle,
  Car,
  Users,
  Video,
  X
} from 'lucide-react';
import { SystemHealth, Incident } from '../types';
import { parseVideoMeta } from '../utils/videoMeta';

interface NavbarProps {
  health: SystemHealth | null;
  activeIncidentsCount: number;
  incidents?: Incident[];
  onSelectIncident?: (inc: Incident) => void;
  onNavigate?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  health,
  activeIncidentsCount,
  incidents = [],
  onSelectIncident,
  onNavigate
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingIncidents = incidents.filter(
    i => i.reviewStatus === 'PENDING_VERIFICATION' || i.reviewStatus === 'UNDER_REVIEW'
  );

  return (
    <header className="h-16 bg-[#0E1420]/95 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: System Status & Pulse */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Emergency Surveillance Intelligence Grid
          </span>
        </div>

        {activeIncidentsCount > 0 ? (
          <button
            onClick={() => setIsNotificationOpen(prev => !prev)}
            className="flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-400 text-xs font-bold animate-pulse shadow-sm shadow-red-950 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{activeIncidentsCount} Incident Candidate(s) Pending Review</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>Surveillance Status: Nominal</span>
          </div>
        )}
      </div>

      {/* Right: Telemetry + Top-Right Shield Notification Box */}
      <div className="flex items-center space-x-4 text-xs text-slate-400" ref={dropdownRef}>
        <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Backend: <strong className="text-slate-200">Spring Boot 3.4</strong></span>
        </div>

        <div className="hidden md:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI Engine: <strong className="text-slate-200">{health?.aiInferenceEngine || 'PyTorch MPS'}</strong></span>
        </div>

        <div className="flex items-center space-x-2 font-mono text-cyan-300 bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-800/40">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{time}</span>
        </div>

        {/* TOP-RIGHT SHIELD NOTIFICATION BUTTON */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(prev => !prev)}
            className={`relative p-2 rounded-xl border transition-all flex items-center justify-center ${
              isNotificationOpen
                ? 'bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-950/50'
                : activeIncidentsCount > 0
                  ? 'bg-slate-900 hover:bg-slate-800 border-red-500/40 text-red-400 hover:text-red-300 shadow-md shadow-red-950/30'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Emergency Incident Verification Queue"
          >
            <span className="text-base select-none mr-1">🛡️</span>
            <span className="font-bold text-xs">
              {activeIncidentsCount > 0 ? activeIncidentsCount : '0'}
            </span>

            {/* Glowing Ping Indicator when pending review items exist */}
            {activeIncidentsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </button>

          {/* TOP-RIGHT NOTIFICATION DROPDOWN DRAWER */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-96 rounded-2xl bg-[#0E1420] border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Emergency Verification Queue</h3>
                    <p className="text-[11px] text-slate-400">
                      <strong className="text-red-400">{pendingIncidents.length} Incident Report(s)</strong> left to review
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Breakdown Bar */}
              <div className="px-4 py-2 bg-[#0B0F17] border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Candidates: <strong className="text-white">{incidents.length}</strong></span>
                <span className="text-amber-400 font-semibold">{pendingIncidents.length} Pending Check</span>
                <span className="text-emerald-400 font-semibold">{incidents.length - pendingIncidents.length} Verified</span>
              </div>

              {/* Scrollable Incidents List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
                {pendingIncidents.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="font-semibold text-white">All Incident Reports Verified!</p>
                    <p className="text-[11px] text-slate-500">No pending collision candidates in the review queue.</p>
                  </div>
                ) : (
                  pendingIncidents.map(inc => {
                    const vMeta = parseVideoMeta(inc.videoJob?.originalFilename, inc.videoJob?.videoId);

                    return (
                      <div
                        key={inc.incidentId}
                        className="p-3 rounded-xl hover:bg-slate-800/60 transition-all space-y-2 group border border-transparent hover:border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-extrabold text-cyan-400 group-hover:text-cyan-300">
                              {inc.incidentId}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${vMeta.badgeClass}`}>
                              {vMeta.shortTag}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-cyan-300">
                            T+{inc.eventTimestamp.toFixed(1)}s
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                          {inc.eventDescription}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span className="text-emerald-400 font-semibold">
                            {(inc.confidenceScore * 100).toFixed(0)}% Confidence
                          </span>
                          <button
                            onClick={() => {
                              setIsNotificationOpen(false);
                              if (onSelectIncident) onSelectIncident(inc);
                            }}
                            className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] flex items-center space-x-1 transition-all"
                          >
                            <span>Review Incident</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Quick Action */}
              <div className="p-3 bg-[#0B0F17] border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsNotificationOpen(false);
                    if (onNavigate) onNavigate('alerts');
                  }}
                  className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs text-center transition-all shadow-md shadow-red-950/40 flex items-center justify-center space-x-1.5"
                >
                  <span>Open Complete Verification Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
