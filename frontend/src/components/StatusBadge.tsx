import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'severity' | 'warning' | 'movement';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'status' }) => {
  let colorClass = 'bg-slate-800 text-slate-300 border-slate-700';

  if (status === 'VERIFIED' || status === 'COMPLETED' || status === 'NORMAL' || status === 'GREEN') {
    colorClass = 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40';
  } else if (status === 'PENDING_VERIFICATION' || status === 'UNDER_REVIEW' || status === 'QUEUED' || status === 'PROCESSING' || status === 'AMBER') {
    colorClass = 'bg-amber-950/60 text-amber-400 border-amber-500/40 animate-pulse';
  } else if (status === 'CRITICAL' || status === 'FAILED' || status === 'REJECTED' || status === 'RED') {
    colorClass = 'bg-red-950/60 text-red-400 border-red-500/50 shadow-sm shadow-red-950';
  } else if (status === 'RESOLVED') {
    colorClass = 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40';
  }

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ');
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {formatText(status)}
    </span>
  );
};
