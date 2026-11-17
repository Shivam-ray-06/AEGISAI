import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant?: 'cyan' | 'red' | 'amber' | 'green' | 'default';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'cyan'
}) => {
  const borderColors = {
    cyan: 'border-cyan-500/30 hover:border-cyan-400/60 shadow-cyan-950/20',
    red: 'border-red-500/30 hover:border-red-400/60 shadow-red-950/20',
    amber: 'border-amber-500/30 hover:border-amber-400/60 shadow-amber-950/20',
    green: 'border-emerald-500/30 hover:border-emerald-400/60 shadow-emerald-950/20',
    default: 'border-slate-800 hover:border-slate-700',
  };

  const iconColors = {
    cyan: 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40',
    red: 'text-red-400 bg-red-950/40 border border-red-800/40',
    amber: 'text-amber-400 bg-amber-950/40 border border-amber-800/40',
    green: 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40',
    default: 'text-slate-400 bg-slate-900 border border-slate-800',
  };

  return (
    <div className={`p-4 rounded-xl bg-[#121824]/90 backdrop-blur-md border ${borderColors[variant]} transition-all duration-200 shadow-lg flex items-center justify-between`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">{title}</p>
        <p className="text-2xl font-extrabold text-white tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${iconColors[variant]}`}>
        {icon}
      </div>
    </div>
  );
};
