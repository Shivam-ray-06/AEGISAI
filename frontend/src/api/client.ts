import axios from 'axios';
import { VideoJob, Incident, VehicleAssessment, PedestrianAssessment, IncidentTimeline, SystemHealth } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // System Health
  getHealth: async (): Promise<SystemHealth> => {
    const res = await apiClient.get('/health');
    return res.data.data;
  },

  // Videos
  uploadVideo: async (file: File, onProgress?: (percent: number) => void): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
    return res.data.data;
  },

  getAllVideos: async (): Promise<VideoJob[]> => {
    const res = await apiClient.get('/videos');
    return res.data.data;
  },

  getVideoById: async (id: string): Promise<VideoJob> => {
    const res = await apiClient.get(`/videos/${id}`);
    return res.data.data;
  },

  startAnalysis: async (id: string): Promise<any> => {
    const res = await apiClient.post(`/videos/${id}/analyze`);
    return res.data.data;
  },

  getVideoStatus: async (id: string): Promise<any> => {
    const res = await apiClient.get(`/videos/${id}/status`);
    return res.data.data;
  },

  getAnnotatedVideoUrl: (id: string) => `${API_BASE_URL}/videos/${id}/annotated`,
  getPreviewVideoUrl: (id: string) => `${API_BASE_URL}/videos/${id}/preview`,
  getThumbnailUrl: (id: string) => `${API_BASE_URL}/videos/${id}/thumbnail`,

  // Incidents
  getAllIncidents: async (): Promise<Incident[]> => {
    const res = await apiClient.get('/incidents');
    return res.data.data;
  },

  getIncidentById: async (id: string): Promise<Incident> => {
    const res = await apiClient.get(`/incidents/${id}`);
    return res.data.data;
  },

  updateIncidentStatus: async (id: string, status: string): Promise<Incident> => {
    const res = await apiClient.patch(`/incidents/${id}/status`, { status });
    return res.data.data;
  },

  getIncidentTimeline: async (id: string): Promise<IncidentTimeline[]> => {
    const res = await apiClient.get(`/incidents/${id}/timeline`);
    return res.data.data;
  },

  // Vehicles & Pedestrians
  getAllVehicles: async (videoId?: string): Promise<VehicleAssessment[]> => {
    const url = videoId ? `/vehicles?videoId=${videoId}` : '/vehicles';
    const res = await apiClient.get(url);
    return res.data.data;
  },

  getAllPedestrians: async (videoId?: string): Promise<PedestrianAssessment[]> => {
    const url = videoId ? `/pedestrians?videoId=${videoId}` : '/pedestrians';
    const res = await apiClient.get(url);
    return res.data.data;
  },

  // Reports
  getReportJsonUrl: (incidentId: string) => `${API_BASE_URL}/reports/${incidentId}`,
  getReportDownloadUrl: (incidentId: string) => `${API_BASE_URL}/reports/${incidentId}/download`,
};
