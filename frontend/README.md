# AEGISAI — React Frontend Dashboard

The **AEGISAI Frontend** is a tactical command-and-control operations dashboard designed for incident monitoring, kinematic evidence review, casualty triage, and multi-quadrant structural chassis damage inspection.

---

## Technical Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **Data Visualization**: Recharts (kinematic velocity curves, impact vectors)
- **Map Visualizations**: Leaflet & React-Leaflet with OpenStreetMap layers
- **Animations & Layout**: Framer Motion
- **State & Data Fetching**: Zustand, Axios

---

## Operations Dashboard Modules

1. **Live Video Feed & AI Annotator (`LiveAnalysisPage.tsx`)**:
   - Synchronized HTML5 video player with interactive canvas overlay.
   - Tactical HUD Watermark & Status Banner displaying timestamp and FPS.
   - **Strict Red/Green Tagging Protocol**:
     - **RED SQUARE BOX**: Collided vehicles in the accident.
     - **GREEN SQUARE BOX**: Safe vehicles in traffic.
     - **RED CIRCLE**: Pedestrians in direct collision impact path.
     - **GREEN CIRCLE**: Normal commuters / safe pedestrians.
2. **Emergency Alert Hub & Kinematic Evidence (`EmergencyAlerts.tsx`)**:
   - Multi-video forensic filtering (Video 1, Video 2, Video 3).
   - Detailed deceleration delta-V, spatial hull encroachment (IoU), and post-impact angular deflection telemetry.
3. **Vehicle Intelligence & Structural Damage Assessment (`VehicleIntelligence.tsx`)**:
   - **Interactive Multi-Quadrant Chassis Heatmaps**: Realistic top-down SVG rendering for both **Sedan / SUV** and **Motorcycle / Bike** vehicle types.
   - Crush depth (cm), deformation percentage, drivability status, and Campbell/CRASH3 structural integrity index.
4. **Medical Digital Twin & Triage Support (`MedicalDigitalTwin.tsx`)**:
   - AIS (Abbreviated Injury Scale) anatomical injury profiling.
   - Priority 1-4 dispatch urgency categorization.
5. **Interactive Global Incident Map (`IncidentMap.tsx`)**:
   - Real-world high-resolution OpenStreetMap layers.
   - Seamless zoom from country and state level down to exact city streets, lanes, and collision GPS coordinates.
6. **Forensic Incident Reports & PDF Export (`IncidentReports.tsx`)**:
   - Complete incident audit trail.
   - Instant **Download Forensic PDF Report** featuring casualty descriptions, involved vehicle models/makes, collision timestamps, and dispatch emergency response units (PCR, Ambulance, Fire Brigade).
7. **Top-Right Quick Notification Hub (`Navbar.tsx`)**:
   - Notification popover activated by clicking the pending review counter or shield icon.

---

## Development & Build Instructions

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
The application will launch at: `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```
