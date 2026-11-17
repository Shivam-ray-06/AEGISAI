import React from 'react';
import { Building2, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const CityAccidentIntelligence: React.FC = () => {
  const data = [
    { intersection: 'Ring Rd / North', incidents: 4, vehicles: 45 },
    { intersection: 'Central Square', incidents: 2, vehicles: 68 },
    { intersection: 'Expressway Exit 12', incidents: 5, vehicles: 82 },
    { intersection: 'Station Boulevard', incidents: 1, vehicles: 39 },
    { intersection: 'Harbor Bridge', incidents: 3, vehicles: 54 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <span>Citywide Traffic & Collision Trend Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Macro-level incident distribution across municipal intersections and high-risk traffic corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Intersection Incident Density Comparison
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="intersection" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="incidents" fill="#EF4444" radius={[4, 4, 0, 0]} name="Collision Candidates" />
                <Bar dataKey="vehicles" fill="#00D2FF" radius={[4, 4, 0, 0]} name="Vehicles Analyzed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#121824]/90 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corridor Safety Score</h2>
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-[#0E1420] border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">Expressway Corridor</span>
                <span className="text-amber-400">High Risk (Zone 3)</span>
              </div>
              <p className="text-[11px] text-slate-400">Frequent deceleration shockwaves detected</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0E1420] border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">Downtown Grid</span>
                <span className="text-emerald-400">Nominal Flow</span>
              </div>
              <p className="text-[11px] text-slate-400">Consistent pedestrian-crossing compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
