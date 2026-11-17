import React from 'react';
import { Settings, Sliders, Shield, Database, Cpu, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Operations & AI Inference Configuration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configurable thresholds, local storage endpoints, and hardware acceleration options.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#121824]/90 border border-slate-800 space-y-6 text-xs">
        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4" />
            <span>Detection & Kinematic Thresholds</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0E1420] border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Confidence Threshold</span>
              <p className="text-white font-mono font-bold">0.25 (Ultralytics default)</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0E1420] border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Collision Proximity Perimeter</span>
              <p className="text-white font-mono font-bold">110.0 pixels</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0E1420] border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Abrupt Deceleration Threshold</span>
              <p className="text-white font-mono font-bold">-15.0 px/s</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0E1420] border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Frame Sampling Step</span>
              <p className="text-white font-mono font-bold">Step 2 (M2 Throughput Optimized)</p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>Hardware & Unified Memory</span>
          </h2>
          <div className="p-4 rounded-xl bg-[#0E1420] border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Apple MPS GPU Acceleration</p>
              <p className="text-[11px] text-slate-400">Targeting MacBook Air M2 unified memory architecture</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
              ENABLED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
