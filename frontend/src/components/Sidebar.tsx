import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Activity,
  MapPin,
  AlertTriangle,
  Building2,
  Car,
  Users,
  HeartPulse,
  FileText,
  Cpu,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'upload', label: 'Video Upload & Analysis', icon: UploadCloud },
    { id: 'live', label: 'Live Analysis', icon: Activity },
    { id: 'map', label: 'Global Incident Map', icon: MapPin },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle },
    { id: 'city', label: 'City Accident Intelligence', icon: Building2 },
    { id: 'vehicles', label: 'Vehicle Intelligence', icon: Car },
    { id: 'pedestrians', label: 'Pedestrian Intelligence', icon: Users },
    { id: 'medical', label: 'Medical Digital Twin', icon: HeartPulse },
    { id: 'reports', label: 'Incident Reports', icon: FileText },
    { id: 'monitoring', label: 'System Monitoring', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0E1420] border-r border-slate-800/80 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/40">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold tracking-wider text-base text-white">AEGIS</span>
            <span className="font-extrabold text-base text-cyan-400">AI</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Ops Command</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">Operations Center</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0B0F17]/60">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">MPS Hardware Active</span>
          </span>
          <span className="font-mono text-[11px] text-cyan-400/80">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
