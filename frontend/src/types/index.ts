export type JobStatus = 'UPLOADED' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type IncidentStatus = 'PENDING_VERIFICATION' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RESOLVED';

export interface VideoJob {
  videoId: string;
  originalFilename: string;
  storagePath: string;
  annotatedVideoPath?: string;
  thumbnailPath?: string;
  fileSizeBytes: number;
  durationSeconds: number;
  fps: number;
  resolution: string;
  status: JobStatus;
  progress: number;
  errorMessage?: string;
  vehiclesCount: number;
  pedestriansCount: number;
  incidentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  incidentId: string;
  videoJob: Partial<VideoJob> & {
    videoId: string;
    originalFilename: string;
  };
  eventTimestamp: number;
  involvedVehicles: string; // JSON string or comma-separated
  nearbyPedestrians: string;
  evidenceDetected: string;
  confidenceScore: number;
  eventDescription: string;
  reviewStatus: IncidentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleAssessment {
  id: number;
  vehicleId: string;
  videoJob: {
    videoId: string;
  };
  vehicleType: string;
  collisionInvolvement: boolean;
  detectionConfidence: number;
  eventTimestamp: number;
  visibleDamageAssessment: string;
  damageSeverity: string;
  assessmentNotes: string;
  reviewStatus: string;
  deformationPercentage?: number;
  crushDepthCm?: number;
  impactZone?: string;
  structuralIntegrityIndex?: number;
  drivabilityStatus?: string;
  structuralZoneDetails?: string;
  createdAt: string;
}

export interface PedestrianAssessment {
  id: number;
  personId: string;
  videoJob: {
    videoId: string;
  };
  detectionConfidence: number;
  eventTimestamp: number;
  collisionProximity: string;
  movementStatus: string;
  warningLevel: 'RED' | 'AMBER' | 'GREEN';
  reviewStatus: string;
  ageDisclaimer: string;
  heightDisclaimer: string;
  consciousnessDisclaimer: string;
  breathingDisclaimer: string;
  injuryDisclaimer: string;
  createdAt: string;
}

export interface IncidentTimeline {
  id: number;
  timestampSeconds: number;
  title: string;
  eventType: 'INFO' | 'CRITICAL' | 'WARNING' | 'SUCCESS';
  description: string;
  createdAt: string;
}

export interface SystemHealth {
  status: string;
  service: string;
  timestamp: string;
  javaVersion: string;
  os: string;
  database: string;
  aiInferenceEngine: string;
}
