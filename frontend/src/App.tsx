import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CommandOverview } from './pages/CommandOverview';
import { VideoUploadPage } from './pages/VideoUploadPage';
import { LiveAnalysisPage } from './pages/LiveAnalysisPage';
import { GlobalIncidentMap } from './pages/GlobalIncidentMap';
import { EmergencyAlerts } from './pages/EmergencyAlerts';
import { CityAccidentIntelligence } from './pages/CityAccidentIntelligence';
import { VehicleIntelligence } from './pages/VehicleIntelligence';
import { PedestrianIntelligence } from './pages/PedestrianIntelligence';
import { MedicalDigitalTwin } from './pages/MedicalDigitalTwin';
import { IncidentReports } from './pages/IncidentReports';
import { SystemMonitoring } from './pages/SystemMonitoring';
import { SettingsPage } from './pages/SettingsPage';
import { api } from './api/client';
import { VideoJob, Incident, VehicleAssessment, PedestrianAssessment, SystemHealth, IncidentStatus } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [videos, setVideos] = useState<VideoJob[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vehicles, setVehicles] = useState<VehicleAssessment[]>([]);
  const [pedestrians, setPedestrians] = useState<PedestrianAssessment[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  const loadAllData = async () => {
    try {
      const [vids, incs, vehs, peds, h] = await Promise.allSettled([
        api.getAllVideos(),
        api.getAllIncidents(),
        api.getAllVehicles(),
        api.getAllPedestrians(),
        api.getHealth(),
      ]);

      if (vids.status === 'fulfilled') {
        setVideos(vids.value);
        if (vids.value.length > 0 && !selectedVideoId) {
          setSelectedVideoId(vids.value[0].videoId);
        }
      }
      if (incs.status === 'fulfilled') setIncidents(incs.value);
      if (vehs.status === 'fulfilled') setVehicles(vehs.value);
      if (peds.status === 'fulfilled') setPedestrians(peds.value);
      if (h.status === 'fulfilled') setHealth(h.value);
    } catch (e) {
      console.error('Error fetching dashboard telemetry:', e);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = (incidentId: string, newStatus: IncidentStatus) => {
    setIncidents(prev =>
      prev.map(i => i.incidentId === incidentId ? { ...i, reviewStatus: newStatus } : i)
    );
  };

  const activeCandidateCount = incidents.filter(
    i => i.reviewStatus === 'PENDING_VERIFICATION' || i.reviewStatus === 'UNDER_REVIEW'
  ).length;

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          health={health}
          activeIncidentsCount={activeCandidateCount}
          incidents={incidents}
          onSelectIncident={(inc) => {
            setSelectedVideoId(inc.videoJob?.videoId);
            setCurrentTab('live');
          }}
          onNavigate={setCurrentTab}
        />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <CommandOverview
              videos={videos}
              incidents={incidents}
              vehicles={vehicles}
              pedestrians={pedestrians}
              onNavigate={setCurrentTab}
              onSelectIncident={(inc) => {
                setSelectedVideoId(inc.videoJob?.videoId);
                setCurrentTab('live');
              }}
            />
          )}

          {currentTab === 'upload' && (
            <VideoUploadPage
              onAnalysisStarted={(vidId) => {
                setSelectedVideoId(vidId);
                loadAllData();
              }}
              onRefreshVideos={loadAllData}
            />
          )}

          {currentTab === 'live' && (
            <LiveAnalysisPage
              videos={videos}
              selectedVideoId={selectedVideoId}
              onSelectVideo={setSelectedVideoId}
              incidents={incidents}
              vehicles={vehicles}
              pedestrians={pedestrians}
              onNavigateToReports={() => setCurrentTab('reports')}
            />
          )}

          {currentTab === 'map' && (
            <GlobalIncidentMap
              incidents={incidents}
              onSelectIncident={(inc) => {
                setSelectedVideoId(inc.videoJob?.videoId);
                setCurrentTab('live');
              }}
            />
          )}

          {currentTab === 'alerts' && (
            <EmergencyAlerts
              incidents={incidents}
              onUpdateStatus={handleUpdateStatus}
              onSelectIncident={(inc) => {
                setSelectedVideoId(inc.videoJob?.videoId);
                setCurrentTab('live');
              }}
            />
          )}

          {currentTab === 'city' && <CityAccidentIntelligence />}

          {currentTab === 'vehicles' && <VehicleIntelligence vehicles={vehicles} />}

          {currentTab === 'pedestrians' && <PedestrianIntelligence pedestrians={pedestrians} />}

          {currentTab === 'medical' && <MedicalDigitalTwin pedestrians={pedestrians} vehicles={vehicles} />}

          {currentTab === 'reports' && (
            <IncidentReports
              incidents={incidents}
              vehicles={vehicles}
              pedestrians={pedestrians}
            />
          )}

          {currentTab === 'monitoring' && (
            <SystemMonitoring health={health} onRefreshHealth={loadAllData} />
          )}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export default App;
