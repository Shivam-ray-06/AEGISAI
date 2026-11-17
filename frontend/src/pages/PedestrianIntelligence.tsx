import React, { useState } from 'react';
import { Users, AlertTriangle, ShieldAlert, HeartPulse, Shield, Info, Activity } from 'lucide-react';
import { PedestrianAssessment } from '../types';

interface PedestrianIntelligenceProps {
  pedestrians: PedestrianAssessment[];
}

export const PedestrianIntelligence: React.FC<PedestrianIntelligenceProps> = ({ pedestrians }) => {
  const [filterWarning, setFilterWarning] = useState<string>('ALL');

  const filtered = pedestrians.filter(p => {
    if (filterWarning === 'ALL') return true;
    return p.warningLevel === filterWarning;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
          <Users className="w-5 h-5 text-amber-400" />
          <span>Pedestrian & Victim Intelligence Module</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Surveillance monitoring of people and vulnerable road users in proximity to detected collision zones.
        </p>
      </div>

      {/* Critical Medical Disclaimer (Mandatory Phase 9 Specification) */}
      <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-200 flex items-start space-x-3 shadow-lg shadow-red-950/20">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold uppercase tracking-wider text-red-300">
            Mandatory Ethical & Medical Emergency Safety Protocol
          </span>
          <p className="text-slate-300 leading-relaxed">
            Movement detection must <strong>never</strong> be interpreted as confirmation of consciousness or breathing. 
            Ordinary CCTV video cannot determine vital signs or internal trauma. All flagged individuals require immediate certified human emergency medical assessment.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-[#121824]/90 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold uppercase">Perimeter Risk Filter:</span>
          <button
            onClick={() => setFilterWarning('ALL')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              filterWarning === 'ALL' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Pedestrians ({pedestrians.length})
          </button>
          <button
            onClick={() => setFilterWarning('RED')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              filterWarning === 'RED' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Critical Alert ({pedestrians.filter(p => p.warningLevel === 'RED').length})
          </button>
          <button
            onClick={() => setFilterWarning('AMBER')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              filterWarning === 'AMBER' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Perimeter Alert ({pedestrians.filter(p => p.warningLevel === 'AMBER').length})
          </button>
          <button
            onClick={() => setFilterWarning('GREEN')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              filterWarning === 'GREEN' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Outer Zone ({pedestrians.filter(p => p.warningLevel === 'GREEN').length})
          </button>
        </div>
        <span className="text-slate-400">Total Tracked: {pedestrians.length}</span>
      </div>

      {/* Pedestrian Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className={`p-5 rounded-xl bg-[#121824]/90 border transition-all ${
              p.warningLevel === 'RED'
                ? 'border-red-500/50 shadow-lg shadow-red-950/30'
                : p.warningLevel === 'AMBER'
                  ? 'border-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'border-slate-800'
            } space-y-3.5`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${
                  p.warningLevel === 'RED'
                    ? 'bg-red-500/20 text-red-400'
                    : p.warningLevel === 'AMBER'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-extrabold text-white">{p.personId}</h3>
                  <p className="text-[11px] text-slate-400">{p.collisionProximity}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                p.warningLevel === 'RED'
                  ? 'bg-red-950 text-red-400 border border-red-500/40 animate-pulse'
                  : p.warningLevel === 'AMBER'
                    ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              }`}>
                {p.warningLevel} WARNING
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Movement Status</span>
                <span className="font-semibold text-white">{p.movementStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Detection Confidence</span>
                <span className="font-semibold text-white">{(p.detectionConfidence * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Perimeter Status</span>
                <span className="font-semibold text-cyan-300">{p.reviewStatus}</span>
              </div>
            </div>

            {/* Structured Medical Limitations Display */}
            <div className="p-3 rounded-lg bg-[#0E1420] border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-1.5 text-slate-400 font-bold uppercase text-[10px]">
                <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                <span>Physiological Telemetry Limitations</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-slate-400">
                <span>Age: <strong className="text-slate-300">{p.ageDisclaimer || 'Not estimated'}</strong></span>
                <span>Height: <strong className="text-slate-300">{p.heightDisclaimer || 'Not estimated'}</strong></span>
              </div>
              <p className="text-slate-400 text-[10px]">
                Consciousness: <strong className="text-amber-400">{p.consciousnessDisclaimer || 'Not determinable'}</strong>
              </p>
              <p className="text-slate-400 text-[10px]">
                Breathing: <strong className="text-amber-400">{p.breathingDisclaimer || 'Not determinable'}</strong>
              </p>
              <p className="text-slate-300 text-[10px] font-semibold border-t border-slate-800/80 pt-1">
                Triage Note: {p.injuryDisclaimer || 'Human emergency assessment required.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
