/**
 * AEGISAI Video Intelligence Metadata Resolver
 * Resolves uploaded and processed video jobs into recognizable accident scenarios (Video 1, Video 2, Video 3)
 */

export interface VideoMeta {
  id: 'VID_1' | 'VID_2' | 'VID_3' | 'OTHER';
  displayName: string;
  shortTag: string;
  scenarioTitle: string;
  scenarioDescription: string;
  cameraType: string;
  badgeClass: string;
  pillClass: string;
  borderClass: string;
  dotColor: string;
  glowClass: string;
}

export function parseVideoMeta(originalFilename?: string, videoId?: string): VideoMeta {
  const fn = (originalFilename || '').toLowerCase();
  const vid = (videoId || '').toLowerCase();

  // Match Video 1 (accident_vid_1.mp4, vid_1.mp4, etc.)
  if (
    fn.includes('vid_1') ||
    fn.includes('vid 1') ||
    fn.includes('vid-1') ||
    fn.includes('accident_vid_1') ||
    vid.includes('8fe446b2') ||
    vid.includes('6aff4313')
  ) {
    return {
      id: 'VID_1',
      displayName: 'Accident Video 1',
      shortTag: 'VIDEO 1',
      scenarioTitle: 'Accident Video 1: High-Speed Intersection Collision',
      scenarioDescription: 'Dashcam forward perspective capturing high-speed vehicle impact with sudden kinetic deflection.',
      cameraType: 'In-Vehicle Dashcam (816x464 @ 60 FPS)',
      badgeClass: 'bg-rose-950/70 text-rose-300 border-rose-500/40',
      pillClass: 'bg-rose-500 text-white',
      borderClass: 'border-rose-500/30',
      dotColor: 'bg-rose-400',
      glowClass: 'shadow-rose-950/30',
    };
  }

  // Match Video 2 (accident_vid_2.mp4, vid 2.mp4, etc.)
  if (
    fn.includes('vid_2') ||
    fn.includes('vid 2') ||
    fn.includes('vid-2') ||
    fn.includes('accident_vid_2') ||
    vid.includes('503ccaf8')
  ) {
    return {
      id: 'VID_2',
      displayName: 'Accident Video 2',
      shortTag: 'VIDEO 2',
      scenarioTitle: 'Accident Video 2: Multi-Lane Urban Corridor Collision',
      scenarioDescription: 'Fixed-angle urban CCTV recording arterial traffic density with multi-vehicle deceleration and roadway blockage.',
      cameraType: 'Fixed Urban Surveillance CCTV (478x850 @ 30 FPS)',
      badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
      pillClass: 'bg-amber-500 text-slate-950',
      borderClass: 'border-amber-500/30',
      dotColor: 'bg-amber-400',
      glowClass: 'shadow-amber-950/30',
    };
  }

  // Match Video 3 (accident_vid_3.mp4, vid 3.mp4, etc.)
  if (
    fn.includes('vid_3') ||
    fn.includes('vid 3') ||
    fn.includes('vid-3') ||
    fn.includes('accident_vid_3')
  ) {
    return {
      id: 'VID_3',
      displayName: 'Accident Video 3',
      shortTag: 'VIDEO 3',
      scenarioTitle: 'Accident Video 3: High-Angle Urban Pedestrian & Crosswalk Corridor',
      scenarioDescription: 'High-angle overhead surveillance camera monitoring crosswalk pedestrian flow and vehicular lane interaction.',
      cameraType: 'High-Angle Overhead Surveillance (720x1282 @ 30 FPS)',
      badgeClass: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40',
      pillClass: 'bg-cyan-500 text-slate-950',
      borderClass: 'border-cyan-500/30',
      dotColor: 'bg-cyan-400',
      glowClass: 'shadow-cyan-950/30',
    };
  }

  return {
    id: 'OTHER',
    displayName: originalFilename || 'Surveillance Feed',
    shortTag: 'SURVEILLANCE',
    scenarioTitle: originalFilename || 'Traffic Surveillance Stream',
    scenarioDescription: 'Autonomous CCTV video feed monitored for traffic flow, kinematic anomalies, and incident detection.',
    cameraType: 'Live / Recorded CCTV Stream',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    pillClass: 'bg-slate-700 text-white',
    borderClass: 'border-slate-800',
    dotColor: 'bg-slate-400',
    glowClass: 'shadow-slate-950/30',
  };
}
