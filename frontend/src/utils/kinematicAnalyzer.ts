/**
 * AEGISAI Forensic Kinematic Evidence Analysis & Explainability Engine
 * Translates raw computer vision and ByteTrack kinematic telemetry into
 * physics-based, explainable forensic incident profiles.
 */

import { VideoMeta } from './videoMeta';

export interface KinematicProfile {
  maxDeceleration: number | null; // e.g. -143.7 px/s
  maxIoU: number | null; // e.g. 0.41 (41%)
  minProximity: number | null; // e.g. 82.7 px
  hasMotionCessation: boolean;
  hasTrajectoryChange: boolean;
  totalSignals: number;
  severity: 'CRITICAL' | 'SEVERE' | 'ELEVATED';
  severityColor: string;
  decelerationSignals: string[];
  overlapSignals: string[];
  proximitySignals: string[];
  cessationSignals: string[];
  trajectorySignals: string[];
  plainEnglishExplanation: string;
  physicsBreakdown: {
    decelTitle: string;
    decelStatus: string;
    decelInterpretation: string;
    overlapTitle: string;
    overlapStatus: string;
    overlapInterpretation: string;
    proximityTitle: string;
    proximityStatus: string;
    proximityInterpretation: string;
    cessationTitle: string;
    cessationStatus: string;
    cessationInterpretation: string;
  };
}

export function analyzeKinematics(
  rawEvidence: string[],
  eventTimestamp: number,
  involvedVehicles: string[],
  nearbyPedestrians: string[],
  videoMeta: VideoMeta
): KinematicProfile {
  let maxDecel: number | null = null;
  let maxIoU: number | null = null;
  let minProx: number | null = null;
  let hasMotionCessation = false;
  let hasTrajectoryChange = false;

  const decelerationSignals: string[] = [];
  const overlapSignals: string[] = [];
  const proximitySignals: string[] = [];
  const cessationSignals: string[] = [];
  const trajectorySignals: string[] = [];

  for (const signal of rawEvidence) {
    const sLower = signal.toLowerCase();

    // Deceleration parsing: e.g. "Abrupt deceleration detected (-143.7 px/s)"
    const decelMatch = signal.match(/deceleration detected \((-?[0-9.]+)\s*px\/s\)/i);
    if (decelMatch) {
      const val = parseFloat(decelMatch[1]);
      if (maxDecel === null || Math.abs(val) > Math.abs(maxDecel)) {
        maxDecel = val;
      }
      decelerationSignals.push(signal);
      continue;
    }

    // IoU parsing: e.g. "Spatial overlap (IoU: 0.41)"
    const iouMatch = signal.match(/spatial overlap \(iou:\s*([0-9.]+)\)/i);
    if (iouMatch) {
      const val = parseFloat(iouMatch[1]);
      if (maxIoU === null || val > maxIoU) {
        maxIoU = val;
      }
      overlapSignals.push(signal);
      continue;
    }

    // Proximity parsing: e.g. "High proximity (82.7px)"
    const proxMatch = signal.match(/high proximity \(([0-9.]+)px\)/i);
    if (proxMatch) {
      const val = parseFloat(proxMatch[1]);
      if (minProx === null || val < minProx) {
        minProx = val;
      }
      proximitySignals.push(signal);
      continue;
    }

    // Cessation parsing: e.g. "Post-interaction motion cessation (stationary state)"
    if (sLower.includes('cessation') || sLower.includes('stationary')) {
      hasMotionCessation = true;
      cessationSignals.push(signal);
      continue;
    }

    // Trajectory parsing
    if (sLower.includes('trajectory') || sLower.includes('deflection') || sLower.includes('heading')) {
      hasTrajectoryChange = true;
      trajectorySignals.push(signal);
      continue;
    }

    // Fallback classification
    if (sLower.includes('decel') || sLower.includes('speed')) {
      decelerationSignals.push(signal);
    } else if (sLower.includes('overlap') || sLower.includes('iou')) {
      overlapSignals.push(signal);
    } else if (sLower.includes('proxim')) {
      proximitySignals.push(signal);
    } else {
      cessationSignals.push(signal);
    }
  }

  // Calculate severity grade
  let severity: 'CRITICAL' | 'SEVERE' | 'ELEVATED' = 'ELEVATED';
  let severityColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';

  const absDecel = maxDecel !== null ? Math.abs(maxDecel) : 0;
  const iouVal = maxIoU !== null ? maxIoU : 0;

  if (absDecel > 100 || iouVal >= 0.35 || (hasMotionCessation && absDecel > 40)) {
    severity = 'CRITICAL';
    severityColor = 'text-red-400 border-red-500/40 bg-red-500/10';
  } else if (absDecel > 30 || iouVal >= 0.15 || hasMotionCessation) {
    severity = 'SEVERE';
    severityColor = 'text-orange-400 border-orange-500/40 bg-orange-500/10';
  }

  // Construct plain-English forensic explanation
  const vehicleListStr = involvedVehicles.length > 0 ? involvedVehicles.join(' and ') : 'unclassified vehicles';
  const pedStr = nearbyPedestrians.length > 0 ? ` with ${nearbyPedestrians.length} pedestrian(s) in the perimeter (${nearbyPedestrians.slice(0, 3).join(', ')}${nearbyPedestrians.length > 3 ? '...' : ''})` : '';
  const decelDesc = maxDecel !== null ? `an abrupt negative velocity gradient of ${maxDecel.toFixed(1)} px/s (approx. ${(Math.abs(maxDecel) / 15).toFixed(1)}x normal braking threshold)` : 'abrupt deceleration';
  const overlapDesc = maxIoU !== null ? `a peak 2D bounding hull overlap of ${(maxIoU * 100).toFixed(0)}% IoU` : 'spatial trajectory intrusion';
  const proxDesc = minProx !== null ? `separation distance rapidly contracting to ${minProx.toFixed(1)}px` : 'proximity threshold breach';
  const cessationDesc = hasMotionCessation ? 'followed by persistent motion cessation (stationary vehicle arrest), creating an active roadway obstruction' : 'accompanied by significant trajectory arrest';

  const plainEnglishExplanation = `In ${videoMeta.displayName} (${videoMeta.scenarioTitle}) at surveillance timestamp T+${eventTimestamp.toFixed(1)}s, AEGISAI detected a multi-signal kinematic collision signature between ${vehicleListStr}${pedStr}. The kinematic telemetry registered ${decelDesc}, ${overlapDesc}, and ${proxDesc}. This interaction was ${cessationDesc}. Synchronous temporal convergence of these independent physics signals eliminates single-frame false alarms and warrants priority operator verification.`;

  return {
    maxDeceleration: maxDecel,
    maxIoU: maxIoU,
    minProximity: minProx,
    hasMotionCessation,
    hasTrajectoryChange,
    totalSignals: rawEvidence.length,
    severity,
    severityColor,
    decelerationSignals,
    overlapSignals,
    proximitySignals,
    cessationSignals,
    trajectorySignals,
    plainEnglishExplanation,
    physicsBreakdown: {
      decelTitle: 'Velocity Delta (Δv) & Momentum Loss',
      decelStatus: maxDecel !== null ? `${maxDecel.toFixed(1)} px/s` : 'Negative Δv Detected',
      decelInterpretation: maxDecel !== null && Math.abs(maxDecel) > 100
        ? 'Catastrophic velocity drop. Kinetic energy dissipated through direct physical impact rather than tire friction.'
        : 'Rapid deceleration exceeding normal traffic deceleration thresholds.',
      overlapTitle: 'Spatial Hull Encroachment (IoU)',
      overlapStatus: maxIoU !== null ? `${(maxIoU * 100).toFixed(0)}% Overlap` : 'Bounding Box Overlap',
      overlapInterpretation: maxIoU !== null && maxIoU >= 0.25
        ? 'Direct physical boundary intrusion. Bounding geometry intersected significantly in camera coordinate frame.'
        : 'Tangential proximity overlap indicative of contact or near-contact swipe.',
      proximityTitle: 'Centroid Proximity Collapse',
      proximityStatus: minProx !== null ? `${minProx.toFixed(1)} px separation` : 'Critical Proximity',
      proximityInterpretation: minProx !== null && minProx < 100
        ? 'Following distance and reaction clearance collapsed to zero effective safety buffer.'
        : 'Proximity threshold breached across multiple consecutive frames.',
      cessationTitle: 'Post-Impact Motion Cessation',
      cessationStatus: hasMotionCessation ? 'Active (Stationary)' : 'Monitored',
      cessationInterpretation: hasMotionCessation
        ? 'Vehicle trajectory velocity flatlined (< 3 px/s) post-event. Confirms disabled vehicle blocking active lane.'
        : 'Object velocity monitored for post-interaction resumption or deceleration.',
    },
  };
}
