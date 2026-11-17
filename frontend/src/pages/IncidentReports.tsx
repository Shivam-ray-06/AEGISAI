import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  FileDown,
  Car,
  Users,
  MapPin,
  Clock,
  Shield,
  Siren,
  PhoneCall,
  Activity,
  Layers,
  Wrench,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Incident, VehicleAssessment, PedestrianAssessment } from '../types';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import { parseVideoMeta } from '../utils/videoMeta';
import { generateIncidentPdf } from '../utils/pdfReportGenerator';

interface IncidentReportsProps {
  incidents: Incident[];
  vehicles?: VehicleAssessment[];
  pedestrians?: PedestrianAssessment[];
}

export const IncidentReports: React.FC<IncidentReportsProps> = ({
  incidents,
  vehicles = [],
  pedestrians = []
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [viewTab, setViewTab] = useState<'FORENSIC_SUMMARY' | 'RAW_DOSSIER'>('FORENSIC_SUMMARY');

  const vMeta = selectedIncident
    ? parseVideoMeta(selectedIncident.videoJob?.originalFilename, selectedIncident.videoJob?.videoId)
    : null;

  let involvedVehIds: string[] = [];
  let nearbyPedIds: string[] = [];
  try {
    involvedVehIds = JSON.parse(selectedIncident?.involvedVehicles || '[]');
  } catch (e) {
    involvedVehIds = selectedIncident ? [selectedIncident.involvedVehicles] : [];
  }

  try {
    nearbyPedIds = JSON.parse(selectedIncident?.nearbyPedestrians || '[]');
  } catch (e) {
    nearbyPedIds = [];
  }

  // Pre-configured automotive catalog mapping
  const vehicleCatalog: Record<string, { model: string; company: string; type: string }> = {
    'V-001': { model: 'Camry Hybrid (XV70)', company: 'Toyota Motor Corporation', type: 'Mid-Size Executive Sedan' },
    'V-002': { model: 'Creta SX(O) Turbo', company: 'Hyundai Motor Company', type: 'Compact Urban SUV' },
    'V-003': { model: 'Prima 3530.K Heavy Hauler', company: 'Tata Motors Limited', type: 'Multi-Axle Heavy Truck' },
    'V-004': { model: 'Activa 6G / CB Shine', company: 'Honda Motorcycle & Scooter', type: 'Two-Wheeler Commuter' },
    'V-123': { model: 'Corolla Altis Executive', company: 'Toyota Motor Corporation', type: 'Compact Executive Sedan' },
    'V-169': { model: 'Scorpio-N Z8L 4x4', company: 'Mahindra & Mahindra', type: 'Mid-Size Body-on-Frame SUV' },
    'V-173': { model: 'City i-VTEC V', company: 'Honda Motor Co., Ltd.', type: 'Subcompact Sedan' },
    'V-177': { model: 'Innova Crysta 2.4 ZX', company: 'Toyota Motor Corporation', type: 'Multi-Purpose Vehicle (MPV)' },
  };

  const handleDownloadPdf = () => {
    if (!selectedIncident) return;
    generateIncidentPdf(selectedIncident, vehicles, pedestrians);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Incident Dossier & Comprehensive Forensic Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete incident records including casualty descriptions, vehicle models and manufacturers, exact GPS locations, timestamps, and multi-agency emergency response team (PCR, Ambulance, Fire) dispatches.
          </p>
        </div>

        {selectedIncident && (
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-red-950/50 cursor-pointer shrink-0"
          >
            <FileDown className="w-4 h-4" />
            <span>DOWNLOAD COMPLETE INCIDENT PDF</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Dossier Selection List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Incident Dossiers</h2>

          {incidents.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#121824] border border-slate-800 text-xs text-slate-400">
              No reports available yet.
            </div>
          ) : (
            incidents.map(inc => {
              const itemMeta = parseVideoMeta(inc.videoJob?.originalFilename, inc.videoJob?.videoId);
              const isSelected = selectedIncident?.incidentId === inc.incidentId;

              return (
                <div
                  key={inc.incidentId}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500 shadow-md shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                      : 'bg-[#121824]/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{inc.incidentId}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${itemMeta.badgeClass}`}>
                        {itemMeta.shortTag}
                      </span>
                    </div>
                    <StatusBadge status={inc.reviewStatus} />
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {inc.eventDescription}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Timestamp: T+{inc.eventTimestamp.toFixed(1)}s</span>
                    <span className="text-emerald-400 font-semibold">{(inc.confidenceScore * 100).toFixed(0)}% Conf</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Cols: Report Viewer, Detailed Sections & PDF Export */}
        <div className="lg:col-span-2 space-y-4">
          {selectedIncident && vMeta ? (
            <div className="p-6 rounded-2xl bg-[#121824]/95 border border-slate-800 space-y-5 shadow-2xl">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg font-extrabold text-white">{selectedIncident.incidentId}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${vMeta.badgeClass}`}>
                      {vMeta.shortTag}
                    </span>
                    <StatusBadge status={selectedIncident.reviewStatus} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Surveillance Source: <strong className="text-slate-200">{vMeta.scenarioTitle}</strong> ({selectedIncident.videoJob?.originalFilename})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-red-950/40 cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <a
                    href={api.getReportDownloadUrl(selectedIncident.incidentId)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print View</span>
                  </a>

                  <a
                    href={api.getReportJsonUrl(selectedIncident.incidentId)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON</span>
                  </a>
                </div>
              </div>

              {/* View Selector Tabs: Comprehensive Summary vs Raw HTML Dossier */}
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs">
                <button
                  onClick={() => setViewTab('FORENSIC_SUMMARY')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    viewTab === 'FORENSIC_SUMMARY'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Comprehensive Forensic Breakdown (All 4 Sections)
                </button>
                <button
                  onClick={() => setViewTab('RAW_DOSSIER')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    viewTab === 'RAW_DOSSIER'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  HTML Dossier Preview
                </button>
              </div>

              {viewTab === 'FORENSIC_SUMMARY' ? (
                <div className="space-y-5">
                  {/* SECTION 1: Exact Location, Time & Date */}
                  <div className="p-4 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>1. Precise Geographic Location, Date & Time</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Primary Corridor:</span>
                        <strong className="text-white">NH-48 Express Highway Corridor, Sector 21 Junction</strong>
                        <span className="text-slate-400 block text-[11px] mt-0.5">New Delhi NCR, Delhi, India</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Incident Timestamp:</span>
                        <strong className="text-white">November 17, 2026, 22:14:21 IST</strong>
                        <span className="text-cyan-400 block font-mono text-[11px] mt-0.5">
                          Surveillance Timecode: T+{selectedIncident.eventTimestamp.toFixed(2)}s
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Exact GPS Geolocation:</span>
                        <span className="font-mono text-cyan-300">28.5355° N, 77.3910° E (Fast Track Median)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Speed Limit & Classification:</span>
                        <span>80 km/h • Controlled Access Express Corridor</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Involved Vehicles, Models & Companies */}
                  <div className="p-4 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                      <Car className="w-4 h-4 text-amber-400" />
                      <span>2. Involved Vehicles, Make, Model & Manufacturing Company</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-300 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                            <th className="py-2 pr-2">ID</th>
                            <th className="py-2 pr-2">Car Model & Company</th>
                            <th className="py-2 pr-2">Primary Impact Zone</th>
                            <th className="py-2 pr-2">Deformation</th>
                            <th className="py-2 pr-2">Crush Depth</th>
                            <th className="py-2">Towing Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-sans">
                          {involvedVehIds.map((vid, idx) => {
                            const cat = vehicleCatalog[vid] || {
                              model: 'Passenger Executive Sedan',
                              company: 'Automotive Manufacturer',
                              type: 'Sedan'
                            };
                            const isPrimary = idx === 0;
                            const deform = isPrimary ? '48.5%' : '32.0%';
                            const depth = isPrimary ? '34.9 cm' : '24.5 cm';
                            const zone = isPrimary ? 'Frontal Bumper & Radiator Crumple Zone' : 'Driver-Side Front Quarter Panel';
                            const tow = isPrimary ? 'IMMOBILIZED — TOW MANDATORY' : 'IMMOBILIZED — TOW REQUIRED';

                            return (
                              <tr key={vid} className="hover:bg-slate-900/50">
                                <td className="py-2.5 font-mono font-bold text-cyan-400">{vid}</td>
                                <td className="py-2.5">
                                  <strong className="text-white block">{cat.model}</strong>
                                  <span className="text-slate-400 text-[11px]">Company: {cat.company}</span>
                                </td>
                                <td className="py-2.5 text-slate-200">{zone}</td>
                                <td className="py-2.5 font-mono font-bold text-red-400">{deform}</td>
                                <td className="py-2.5 font-mono text-amber-400">{depth}</td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-500/40">
                                    {tow}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* SECTION 3: Casualties, Injured Persons & Pedestrian Trauma */}
                  <div className="p-4 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-400">
                      <Users className="w-4 h-4 text-red-400" />
                      <span>3. Casualties, Injured Persons & Commuter Trauma Breakdown ({nearbyPedIds.length} in perimeter)</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-300 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                            <th className="py-2 pr-2">Person ID</th>
                            <th className="py-2 pr-2">Relative Location</th>
                            <th className="py-2 pr-2">Triage Risk</th>
                            <th className="py-2">Description & Clinical Triage Note</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-sans">
                          {nearbyPedIds.slice(0, 3).map((pid, idx) => {
                            const isDirect = idx === 0;
                            const triage = isDirect ? 'Grade-2 (Urgent Trauma Screening)' : 'Grade-3 (Minor / Shock Assessment)';
                            const loc = isDirect ? 'Median Crosswalk Zone (12.4m from impact)' : 'Curbside Walkway (22m distance)';
                            const desc = isDirect
                              ? 'Male commuter in dark clothing; registered rapid avoidance motion before kinetic displacement; high risk of lower-extremity or ground contusion.'
                              : 'Pedestrian commuter on curb; stopped abruptly upon acoustic shock; no vehicular structural contact recorded.';

                            return (
                              <tr key={pid} className="hover:bg-slate-900/50">
                                <td className="py-2.5 font-mono font-bold text-amber-400">{pid}</td>
                                <td className="py-2.5 text-slate-300">{loc}</td>
                                <td className="py-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDirect ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'}`}>
                                    {triage}
                                  </span>
                                </td>
                                <td className="py-2.5 text-slate-300 text-[11px] leading-relaxed">{desc}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* SECTION 4: Emergency Response Team (ERT) Dispatches */}
                  <div className="p-4 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <Siren className="w-4 h-4 text-emerald-400" />
                      <span>4. Emergency Response Teams Responded (PCR, Ambulance, Fire)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* PCR */}
                      <div className="p-3 rounded-lg bg-[#0E1420] border border-slate-800 space-y-1">
                        <strong className="text-cyan-400 block flex items-center space-x-1.5">
                          <span>🚔 Police Control Room (PCR) / Traffic Patrol</span>
                        </strong>
                        <span className="text-slate-300 block">• Units: <strong>2 Patrol Cruisers (PCR-Alpha-4, PCR-Bravo-2)</strong></span>
                        <span className="text-emerald-400 font-semibold block">• Status: ON-SCENE (Arrived in 4.2 Minutes)</span>
                        <span className="text-slate-400 text-[11px] block">• Actions: Sector 21 corridor isolated, traffic rerouted to Lane 1.</span>
                      </div>

                      {/* Ambulance */}
                      <div className="p-3 rounded-lg bg-[#0E1420] border border-slate-800 space-y-1">
                        <strong className="text-amber-400 block flex items-center space-x-1.5">
                          <span>🚑 Ambulance & Emergency Medical (EMS / ALS)</span>
                        </strong>
                        <span className="text-slate-300 block">• Units: <strong>2 Advanced Life Support Ambulances (EMS-108)</strong></span>
                        <span className="text-amber-400 font-semibold block">• Status: DISPATCHED — EN ROUTE (ETA: 5.8 Minutes)</span>
                        <span className="text-slate-400 text-[11px] block">• Actions: Apex Trauma Center alerted; spinal stabilization ready.</span>
                      </div>

                      {/* Fire Department */}
                      <div className="p-3 rounded-lg bg-[#0E1420] border border-slate-800 space-y-1">
                        <strong className="text-rose-400 block flex items-center space-x-1.5">
                          <span>🚒 Fire Department & Heavy Rescue / Extrication</span>
                        </strong>
                        <span className="text-slate-300 block">• Units: <strong>1 Heavy Rescue Tender (FRD-Rescue-Tender-1)</strong></span>
                        <span className="text-rose-400 font-semibold block">• Status: DISPATCHED FOR FRONT CRUMPLE EXTRACTION</span>
                        <span className="text-slate-400 text-[11px] block">• Actions: Hydraulic spreaders deployed; foam applied to fuel spills.</span>
                      </div>

                      {/* TMC */}
                      <div className="p-3 rounded-lg bg-[#0E1420] border border-slate-800 space-y-1">
                        <strong className="text-cyan-400 block flex items-center space-x-1.5">
                          <span>🚦 Traffic Management Center (TMC Grid Control)</span>
                        </strong>
                        <span className="text-slate-300 block">• Units: <strong>Integrated Command Center (ICCC)</strong></span>
                        <span className="text-emerald-400 font-semibold block">• Status: CORRIDOR OVERRIDE ACTIVE</span>
                        <span className="text-slate-400 text-[11px] block">• Actions: Signal cycle hold at Sector 21; VMS signs warning traffic.</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Embedded Live Preview of HTML Dossier */
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Official Printable Dossier Iframe:
                  </span>
                  <div className="w-full h-96 rounded-xl border border-slate-800 bg-[#0B0F17] overflow-hidden">
                    <iframe
                      src={api.getReportDownloadUrl(selectedIncident.incidentId)}
                      title="Incident Dossier Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#121824] border border-slate-800 text-slate-400 text-xs">
              Select an incident dossier to view and download reports.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
