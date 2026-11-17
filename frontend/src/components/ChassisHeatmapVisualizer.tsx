import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Wrench, AlertTriangle, Info } from 'lucide-react';

export type VehicleBodyType = 'SEDAN' | 'SUV' | 'BIKE';

interface ChassisHeatmapVisualizerProps {
  vehicleType: string; // 'Car', 'Motorcycle', 'Truck', 'Bus', 'Bicycle', 'Sedan', 'Suv', etc.
  deformationPercentage: number;
  crushDepthCm: number;
  impactZone: string;
  impactZoneLabel: string;
  structuralIntegrityIndex: number;
  drivabilityLabel: string;
}

export const ChassisHeatmapVisualizer: React.FC<ChassisHeatmapVisualizerProps> = ({
  vehicleType,
  deformationPercentage,
  crushDepthCm,
  impactZone,
  impactZoneLabel,
  structuralIntegrityIndex,
  drivabilityLabel,
}) => {
  // Determine detected vehicle shape
  const getAutoBodyType = (typeStr: string): VehicleBodyType => {
    const t = (typeStr || '').toLowerCase();
    if (t.includes('motorcycle') || t.includes('bike') || t.includes('bicycle') || t.includes('two-wheeler')) {
      return 'BIKE';
    }
    if (t.includes('suv') || t.includes('truck') || t.includes('bus') || t.includes('pickup') || t.includes('creta') || t.includes('scorpio')) {
      return 'SUV';
    }
    return 'SEDAN';
  };

  const [activeShape, setActiveShape] = useState<VehicleBodyType>(getAutoBodyType(vehicleType));
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  useEffect(() => {
    setActiveShape(getAutoBodyType(vehicleType));
  }, [vehicleType]);

  const pct = deformationPercentage || 0;
  const isHit = pct > 0;

  // Dynamic zone deformation values
  const frontPct = isHit ? pct : 0;
  const leftPct = isHit ? Number((pct * 0.42).toFixed(1)) : 0;
  const rightPct = isHit ? Number((pct * 0.28).toFixed(1)) : 0;
  const cabinPct = isHit ? Number((pct * 0.22).toFixed(1)) : 0;
  const rearPct = isHit ? Number((pct * 0.08).toFixed(1)) : 0;

  // Color generator based on deformation severity
  const getZoneColor = (zonePct: number, isSelected: boolean = false) => {
    if (zonePct === 0) {
      return isSelected ? '#1e293b' : 'rgba(30, 41, 59, 0.5)';
    }
    if (zonePct > 45) {
      return isSelected ? 'rgba(239, 68, 68, 0.85)' : 'rgba(239, 68, 68, 0.55)';
    }
    if (zonePct > 20) {
      return isSelected ? 'rgba(245, 158, 11, 0.85)' : 'rgba(245, 158, 11, 0.55)';
    }
    return isSelected ? 'rgba(56, 189, 248, 0.85)' : 'rgba(56, 189, 248, 0.45)';
  };

  const getZoneStroke = (zonePct: number) => {
    if (zonePct === 0) return '#475569';
    if (zonePct > 45) return '#ef4444';
    if (zonePct > 20) return '#f59e0b';
    return '#38bdf8';
  };

  return (
    <div className="flex flex-col items-center justify-between p-4 rounded-xl bg-[#0B0F17] border border-slate-800/90 shadow-xl space-y-3 w-full">
      {/* Top Controls: Vehicle Type Switcher */}
      <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-2">
        <span className="text-[11px] font-black uppercase text-slate-300 tracking-wider flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Structural Chassis Heatmap</span>
        </span>

        {/* Shape Toggle Buttons */}
        <div className="flex items-center space-x-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
          <button
            onClick={() => setActiveShape('SEDAN')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeShape === 'SEDAN' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚗 Sedan
          </button>
          <button
            onClick={() => setActiveShape('SUV')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeShape === 'SUV' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚙 SUV
          </button>
          <button
            onClick={() => setActiveShape('BIKE')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeShape === 'BIKE' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏍️ Bike
          </button>
        </div>
      </div>

      {/* Main SVG Blueprint Canvas */}
      <div className="relative w-64 h-80 flex items-center justify-center p-2">
        {/* ============================================================== */}
        {/* 1. REAL MOTORCYCLE / BIKE TOP-DOWN CHASSIS BLUEPRINT           */}
        {/* ============================================================== */}
        {activeShape === 'BIKE' && (
          <svg
            viewBox="0 0 200 320"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <defs>
              <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Frame Central Spine */}
            <line x1="100" y1="40" x2="100" y2="280" stroke="#475569" strokeWidth="4" strokeDasharray="3 3" />

            {/* ZONE 1: FRONT TIRE & FORK IMPACT ZONE */}
            <g
              onMouseEnter={() => setHoveredZone('FRONT_FORK')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer transition-all"
            >
              {/* Front Wheel */}
              <rect x="91" y="20" width="18" height="65" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              {/* Front Fork & Caliper Assembly */}
              <path
                d="M80,55 L90,65 L90,95 L80,95 Z M120,55 L110,65 L110,95 L120,95 Z"
                fill={getZoneColor(frontPct, hoveredZone === 'FRONT_FORK')}
                stroke={getZoneStroke(frontPct)}
                strokeWidth="2"
              />
              {/* Front Fender Mudguard */}
              <path
                d="M84,35 C84,20 116,20 116,35 L114,65 C114,50 86,50 86,65 Z"
                fill={getZoneColor(frontPct, hoveredZone === 'FRONT_FORK')}
                stroke={getZoneStroke(frontPct)}
                strokeWidth="1.5"
                opacity="0.9"
              />
            </g>

            {/* ZONE 2: STEERING HEAD & HANDLEBARS */}
            <g
              onMouseEnter={() => setHoveredZone('HANDLEBARS')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              {/* Handlebar Left & Right with Grips */}
              <path
                d="M50,90 C70,95 85,90 100,92 C115,90 130,95 150,90"
                fill="none"
                stroke={getZoneStroke(leftPct)}
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Mirrors */}
              <circle cx="48" cy="84" r="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
              <circle cx="152" cy="84" r="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
              {/* Headlight Cluster */}
              <polygon points="90,75 110,75 105,90 95,90" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
            </g>

            {/* ZONE 3: FUEL TANK & LEFT COWL */}
            <g
              onMouseEnter={() => setHoveredZone('FUEL_TANK_LEFT')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <path
                d="M100,95 C78,98 72,130 80,155 C90,165 98,168 100,168 Z"
                fill={getZoneColor(leftPct, hoveredZone === 'FUEL_TANK_LEFT')}
                stroke={getZoneStroke(leftPct)}
                strokeWidth="2"
              />
            </g>

            {/* ZONE 4: FUEL TANK & RIGHT COWL */}
            <g
              onMouseEnter={() => setHoveredZone('FUEL_TANK_RIGHT')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <path
                d="M100,95 C122,98 128,130 120,155 C110,165 102,168 100,168 Z"
                fill={getZoneColor(rightPct, hoveredZone === 'FUEL_TANK_RIGHT')}
                stroke={getZoneStroke(rightPct)}
                strokeWidth="2"
              />
            </g>

            {/* Rider Seat & Footpegs (Center Mid-Chassis) */}
            <g>
              {/* Engine Block visible from sides */}
              <rect x="78" y="140" width="44" height="25" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              {/* Rider Saddle */}
              <path
                d="M85,168 C80,185 80,205 84,215 C95,218 105,218 116,215 C120,205 120,185 115,168 Z"
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth="2"
              />
              {/* Pillion Seat */}
              <path
                d="M88,216 C85,230 86,245 92,252 C98,254 102,254 108,252 C114,245 115,230 112,216 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
              />
            </g>

            {/* ZONE 5: REAR SWINGARM, EXHAUST & REAR TIRE */}
            <g
              onMouseEnter={() => setHoveredZone('REAR_SWINGARM')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              {/* Exhaust Muffler on right */}
              <rect x="120" y="210" width="10" height="60" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Rear Tire */}
              <rect x="89" y="240" width="22" height="70" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              {/* Rear Fender / Tail Light */}
              <polygon
                points="94,250 106,250 103,275 97,275"
                fill={getZoneColor(rearPct, hoveredZone === 'REAR_SWINGARM')}
                stroke={getZoneStroke(rearPct)}
                strokeWidth="1.5"
              />
              <circle cx="100" cy="272" r="3" fill="#ef4444" />
            </g>
          </svg>
        )}

        {/* ============================================================== */}
        {/* 2. REAL SEDAN CAR TOP-DOWN CHASSIS BLUEPRINT                   */}
        {/* ============================================================== */}
        {activeShape === 'SEDAN' && (
          <svg
            viewBox="0 0 200 320"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            {/* 4 Tires at Corners */}
            <rect x="24" y="55" width="16" height="38" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
            <rect x="160" y="55" width="16" height="38" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
            <rect x="24" y="225" width="16" height="38" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
            <rect x="160" y="225" width="16" height="38" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="2" />

            {/* ZONE 1: FRONTAL BUMPER & HOOD CRUMPLE ZONE */}
            <g
              onMouseEnter={() => setHoveredZone('FRONT_BUMPER')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              {/* Front Bumper Curve */}
              <path
                d="M38,55 C45,28 75,18 100,18 C125,18 155,28 162,55 L158,105 C140,110 60,110 42,105 Z"
                fill={getZoneColor(frontPct, hoveredZone === 'FRONT_BUMPER')}
                stroke={getZoneStroke(frontPct)}
                strokeWidth="2"
              />
              {/* Headlights */}
              <path d="M42,32 C48,26 58,26 62,35 Z" fill="#fef08a" opacity="0.9" />
              <path d="M158,32 C152,26 142,26 138,35 Z" fill="#fef08a" opacity="0.9" />
              {/* Hood Crease Lines */}
              <line x1="72" y1="40" x2="68" y2="98" stroke="#475569" strokeWidth="1.5" />
              <line x1="128" y1="40" x2="132" y2="98" stroke="#475569" strokeWidth="1.5" />
            </g>

            {/* Windshield */}
            <path
              d="M48,105 C55,103 145,103 152,105 L144,140 C130,138 70,138 56,140 Z"
              fill="#0284c7"
              opacity="0.35"
              stroke="#0ea5e9"
              strokeWidth="1.5"
            />

            {/* ZONE 2: DRIVER-SIDE FLANK & A/B PILLARS (LEFT) */}
            <g
              onMouseEnter={() => setHoveredZone('LEFT_FLANK')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <path
                d="M38,105 L56,140 L52,215 L36,215 Z"
                fill={getZoneColor(leftPct, hoveredZone === 'LEFT_FLANK')}
                stroke={getZoneStroke(leftPct)}
                strokeWidth="2"
              />
              {/* Left Mirror */}
              <rect x="28" y="106" width="10" height="6" rx="2" fill="#38bdf8" />
            </g>

            {/* ZONE 3: PASSENGER-SIDE FLANK (RIGHT) */}
            <g
              onMouseEnter={() => setHoveredZone('RIGHT_FLANK')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <path
                d="M162,105 L144,140 L148,215 L164,215 Z"
                fill={getZoneColor(rightPct, hoveredZone === 'RIGHT_FLANK')}
                stroke={getZoneStroke(rightPct)}
                strokeWidth="2"
              />
              {/* Right Mirror */}
              <rect x="162" y="106" width="10" height="6" rx="2" fill="#38bdf8" />
            </g>

            {/* ZONE 4: PASSENGER CABIN CELL ROOF */}
            <g
              onMouseEnter={() => setHoveredZone('CABIN_CELL')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <path
                d="M56,140 L144,140 L142,215 L58,215 Z"
                fill={getZoneColor(cabinPct, hoveredZone === 'CABIN_CELL')}
                stroke={getZoneStroke(cabinPct)}
                strokeWidth="1.5"
              />
              {/* Sunroof */}
              <rect x="75" y="152" width="50" height="36" rx="4" fill="#0369a1" opacity="0.4" stroke="#38bdf8" strokeWidth="1" />
            </g>

            {/* Rear Windshield */}
            <path
              d="M58,215 C70,218 130,218 142,215 L146,242 C135,244 65,244 54,242 Z"
              fill="#0284c7"
              opacity="0.35"
              stroke="#0ea5e9"
              strokeWidth="1.5"
            />

            {/* ZONE 5: REAR TRUNK & BUMPER */}
            <g
              onMouseEnter={() => setHoveredZone('REAR_TRUNK')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <path
                d="M54,242 C65,244 135,244 146,242 L160,270 C145,295 55,295 40,270 Z"
                fill={getZoneColor(rearPct, hoveredZone === 'REAR_TRUNK')}
                stroke={getZoneStroke(rearPct)}
                strokeWidth="2"
              />
              {/* Tail Lights */}
              <path d="M42,272 L58,276 L52,282 Z" fill="#ef4444" />
              <path d="M158,272 L142,276 L148,282 Z" fill="#ef4444" />
            </g>
          </svg>
        )}

        {/* ============================================================== */}
        {/* 3. REAL SUV / TRUCK TOP-DOWN CHASSIS BLUEPRINT                 */}
        {/* ============================================================== */}
        {activeShape === 'SUV' && (
          <svg
            viewBox="0 0 200 320"
            className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            {/* Heavy All-Terrain Tires */}
            <rect x="18" y="52" width="20" height="46" rx="4" fill="#020617" stroke="#475569" strokeWidth="2.5" />
            <rect x="162" y="52" width="20" height="46" rx="4" fill="#020617" stroke="#475569" strokeWidth="2.5" />
            <rect x="18" y="222" width="20" height="46" rx="4" fill="#020617" stroke="#475569" strokeWidth="2.5" />
            <rect x="162" y="222" width="20" height="46" rx="4" fill="#020617" stroke="#475569" strokeWidth="2.5" />

            {/* ZONE 1: HEAVY REINFORCED SUV BUMPER & BULLBAR */}
            <g
              onMouseEnter={() => setHoveredZone('FRONT_BUMPER')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              {/* Rugged Front Bumper & Skid Plate */}
              <path
                d="M34,50 C40,22 80,15 100,15 C120,15 160,22 166,50 L166,108 L34,108 Z"
                fill={getZoneColor(frontPct, hoveredZone === 'FRONT_BUMPER')}
                stroke={getZoneStroke(frontPct)}
                strokeWidth="2.5"
              />
              {/* Bullbar Guard */}
              <rect x="65" y="13" width="70" height="8" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Aggressive Headlamp Clusters */}
              <polygon points="38,36 58,26 56,44 42,46" fill="#fef08a" />
              <polygon points="162,36 142,26 144,44 158,46" fill="#fef08a" />
              {/* Power Bulge Hood Lines */}
              <line x1="75" y1="45" x2="72" y2="105" stroke="#64748b" strokeWidth="2" />
              <line x1="125" y1="45" x2="128" y2="105" stroke="#64748b" strokeWidth="2" />
            </g>

            {/* Upright SUV Windshield */}
            <path
              d="M44,108 L156,108 L148,142 L52,142 Z"
              fill="#0284c7"
              opacity="0.38"
              stroke="#0ea5e9"
              strokeWidth="2"
            />

            {/* ZONE 2: HEAVY DRIVER-SIDE FLANK (LEFT) */}
            <g
              onMouseEnter={() => setHoveredZone('LEFT_FLANK')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <path
                d="M34,108 L52,142 L50,228 L32,228 Z"
                fill={getZoneColor(leftPct, hoveredZone === 'LEFT_FLANK')}
                stroke={getZoneStroke(leftPct)}
                strokeWidth="2.5"
              />
              {/* Chunky SUV Mirror */}
              <polygon points="20,108 34,108 34,116 22,116" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
              {/* Running board sill */}
              <line x1="26" y1="125" x2="26" y2="210" stroke="#94a3b8" strokeWidth="2.5" />
            </g>

            {/* ZONE 3: PASSENGER-SIDE FLANK (RIGHT) */}
            <g
              onMouseEnter={() => setHoveredZone('RIGHT_FLANK')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <path
                d="M166,108 L148,142 L150,228 L168,228 Z"
                fill={getZoneColor(rightPct, hoveredZone === 'RIGHT_FLANK')}
                stroke={getZoneStroke(rightPct)}
                strokeWidth="2.5"
              />
              {/* Right Chunky Mirror */}
              <polygon points="180,108 166,108 166,116 178,116" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
              {/* Right Running board */}
              <line x1="174" y1="125" x2="174" y2="210" stroke="#94a3b8" strokeWidth="2.5" />
            </g>

            {/* ZONE 4: HIGH-STRENGTH REINFORCED CABIN & ROOF RAILS */}
            <g
              onMouseEnter={() => setHoveredZone('CABIN_CELL')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <rect
                x="52"
                y="142"
                width="96"
                height="86"
                fill={getZoneColor(cabinPct, hoveredZone === 'CABIN_CELL')}
                stroke={getZoneStroke(cabinPct)}
                strokeWidth="2"
              />
              {/* Dual Roof Rack Rails */}
              <line x1="60" y1="145" x2="60" y2="225" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
              <line x1="140" y1="145" x2="140" y2="225" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
              {/* Crossbars */}
              <line x1="60" y1="165" x2="140" y2="165" stroke="#94a3b8" strokeWidth="2" />
              <line x1="60" y1="205" x2="140" y2="205" stroke="#94a3b8" strokeWidth="2" />
            </g>

            {/* Rear Tailgate Window */}
            <path
              d="M50,228 L150,228 L154,255 L46,255 Z"
              fill="#0284c7"
              opacity="0.38"
              stroke="#0ea5e9"
              strokeWidth="2"
            />

            {/* ZONE 5: BOXED REAR HATCH & HEAVY BUMPER */}
            <g
              onMouseEnter={() => setHoveredZone('REAR_TRUNK')}
              onMouseLeave={() => setHoveredZone(null)}
              className="cursor-pointer"
            >
              <path
                d="M46,255 L154,255 L164,285 C150,295 50,295 36,285 Z"
                fill={getZoneColor(rearPct, hoveredZone === 'REAR_TRUNK')}
                stroke={getZoneStroke(rearPct)}
                strokeWidth="2.5"
              />
              {/* High Mounted LED Brake Light Bar */}
              <line x1="82" y1="230" x2="118" y2="230" stroke="#ef4444" strokeWidth="3" />
              {/* Heavy Tow Hitch / Dual Exhaust */}
              <rect x="94" y="288" width="12" height="6" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            </g>
          </svg>
        )}
      </div>

      {/* Dynamic Zone Readout & Damage Legend */}
      <div className="w-full bg-[#0E1420] p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-semibold">Active Blueprint:</span>
          <span className="font-bold text-white uppercase font-mono">
            {activeShape === 'BIKE' ? '🏍️ Motorcycle Frame' : activeShape === 'SUV' ? '🚙 Boxed SUV Chassis' : '🚗 Monocoque Sedan'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-semibold">Primary Impact:</span>
          <span className="font-mono text-red-400 font-bold">{frontPct > 0 ? `${frontPct}% Crumple` : '0.0% Intact'}</span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/60 pt-1">
          <span className="text-slate-400">Impact Depth:</span>
          <span className="font-mono text-amber-300 font-bold">{crushDepthCm} cm</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Residual Hull:</span>
          <span className="font-mono text-emerald-400 font-bold">{structuralIntegrityIndex}%</span>
        </div>
      </div>
    </div>
  );
};
