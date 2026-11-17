import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  ShieldAlert,
  Car,
  Users,
  Compass,
  Crosshair,
  ExternalLink,
  Flame,
  Maximize2
} from 'lucide-react';
import { Incident } from '../types';

interface GlobalIncidentMapProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

// Sample incident geo-locations with high-precision street & lane coordinates
const INCIDENT_LOCATIONS: Record<string, { lat: number; lng: number; locationName: string; city: string; state: string; country: string; lane: string }> = {
  default: {
    lat: 28.6139,
    lng: 77.2090,
    locationName: 'Inner Ring Road, Corridor Sector 4',
    city: 'New Delhi',
    state: 'Delhi NCR',
    country: 'India',
    lane: 'Lane 2 (Eastbound Carriageway)'
  },
  secondary: {
    lat: 19.0760,
    lng: 72.8777,
    locationName: 'Western Express Highway, Flyover Junction',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    lane: 'Fast Lane & Service Merge'
  },
  tertiary: {
    lat: 12.9716,
    lng: 77.5946,
    locationName: 'Outer Ring Road, Marathahalli Tech Corridor',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    lane: 'Lane 1 & Bus Rapid Transit Border'
  }
};

export const GlobalIncidentMap: React.FC<GlobalIncidentMapProps> = ({ incidents, onSelectIncident }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [currentZoom, setCurrentZoom] = useState<number>(14);
  const [zoomLevelName, setZoomLevelName] = useState<string>('Urban Surveillance');
  const [currentTileProvider, setCurrentTileProvider] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const [selectedIncidentForDrawer, setSelectedIncidentForDrawer] = useState<Incident | null>(incidents[0] || null);

  // Map Tile Providers
  const TILE_URLS = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const getZoomLabel = (zoom: number) => {
    if (zoom <= 3) return { level: 'GLOBAL', desc: 'World & Continents View' };
    if (zoom <= 6) return { level: 'COUNTRY', desc: 'National Border & Country View' };
    if (zoom <= 9) return { level: 'STATE / PROVINCE', desc: 'State & Regional Highway System' };
    if (zoom <= 13) return { level: 'CITY / DISTRICT', desc: 'Metropolitan Urban Grid' };
    if (zoom <= 16) return { level: 'STREET / SECTOR', desc: 'Street Corridors & Intersections' };
    return { level: 'TACTICAL ROAD LANE', desc: 'Accident Impact Zone & Individual Traffic Lanes' };
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const primaryLoc = INCIDENT_LOCATIONS.default;
      const map = L.map(mapContainerRef.current, {
        center: [primaryLoc.lat, primaryLoc.lng],
        zoom: 15,
        maxZoom: 19,
        minZoom: 2,
        zoomControl: false,
      });

      const tiles = L.tileLayer(TILE_URLS.dark, {
        attribution: '&copy; CartoDB &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tiles;
      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      map.on('zoomend', () => {
        const z = map.getZoom();
        setCurrentZoom(z);
        const info = getZoomLabel(z);
        setZoomLevelName(`${info.level} — ${info.desc}`);
      });
    }

    renderIncidentMarkers();

    return () => {
      // Keep map alive or cleanup if needed
    };
  }, [incidents]);

  const changeTileLayer = (provider: 'dark' | 'streets' | 'satellite') => {
    if (!mapInstanceRef.current) return;
    setCurrentTileProvider(provider);
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTiles = L.tileLayer(TILE_URLS[provider], {
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
  };

  const renderIncidentMarkers = () => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    markersGroupRef.current.clearLayers();

    incidents.forEach((inc, index) => {
      const geo = index === 0 ? INCIDENT_LOCATIONS.default : index === 1 ? INCIDENT_LOCATIONS.secondary : INCIDENT_LOCATIONS.tertiary;

      // Custom animated pulse marker icon
      const customIcon = L.divIcon({
        className: 'custom-incident-pin',
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(239, 68, 68, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: #EF4444; border: 2px solid #FFFFFF; box-shadow: 0 0 14px rgba(239, 68, 68, 0.8); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
              !
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([geo.lat, geo.lng], { icon: customIcon });

      // Lane-level radius circle
      const impactZone = L.circle([geo.lat, geo.lng], {
        radius: 35, // 35 meters (accident perimeter)
        color: '#EF4444',
        weight: 2,
        fillColor: '#EF4444',
        fillOpacity: 0.25,
        dashArray: '4, 6',
      });

      marker.on('click', () => {
        setSelectedIncidentForDrawer(inc);
        mapInstanceRef.current?.flyTo([geo.lat, geo.lng], 18, {
          duration: 1.5,
        });
      });

      markersGroupRef.current.addLayer(marker);
      markersGroupRef.current.addLayer(impactZone);
    });
  };

  const zoomToAccidentLane = (geoKey: 'default' | 'secondary' | 'tertiary') => {
    const geo = INCIDENT_LOCATIONS[geoKey];
    mapInstanceRef.current?.flyTo([geo.lat, geo.lng], 18, {
      duration: 1.8,
    });
  };

  const resetToGlobal = () => {
    mapInstanceRef.current?.flyTo([20.5937, 78.9629], 4, {
      duration: 1.5,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-wide uppercase flex items-center space-x-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Interactive Global & Lane-Level Incident Radar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real interactive GIS map. Zoom seamlessly from global countries down to exact municipal road lanes and collision impact radii.
          </p>
        </div>

        {/* Live Dynamic Zoom Resolution Indicator */}
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-cyan-500/30 px-3.5 py-1.5 rounded-lg shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <div className="text-[11px]">
            <span className="text-slate-400 uppercase font-bold mr-1.5">Zoom Level {currentZoom}:</span>
            <strong className="text-cyan-300 font-mono tracking-wide">{zoomLevelName}</strong>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#090D14]">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-[580px] z-10" />

        {/* Floating Controls: Layer Switcher & Preset Zoom */}
        <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
          {/* Tile Layer Selector */}
          <div className="p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-xl flex items-center space-x-1 text-xs">
            <button
              onClick={() => changeTileLayer('dark')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                currentTileProvider === 'dark' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Dark Tactical
            </button>
            <button
              onClick={() => changeTileLayer('satellite')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                currentTileProvider === 'satellite' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => changeTileLayer('streets')}
              className={`px-2.5 py-1 rounded font-semibold transition-all ${
                currentTileProvider === 'streets' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Street Map
            </button>
          </div>

          {/* Quick Zoom Buttons */}
          <div className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-xl space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              Quick Telemetry Jumps:
            </span>
            <button
              onClick={() => zoomToAccidentLane('default')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 font-medium flex items-center space-x-1.5 transition-all"
            >
              <Crosshair className="w-3.5 h-3.5 shrink-0 text-red-400" />
              <span className="truncate">Zoom to Accident Lane (Level 18)</span>
            </button>
            <button
              onClick={resetToGlobal}
              className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium flex items-center space-x-1.5 transition-all"
            >
              <Navigation className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span>Reset to National/Global</span>
            </button>
          </div>
        </div>

        {/* Floating Bottom Telemetry Bar */}
        <div className="absolute bottom-4 left-4 z-20 max-w-md p-3.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Target Incident Hotspot Telemetry</span>
            </span>
            <span className="font-mono text-[11px] text-cyan-400 font-semibold">GPS Active</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div>Country: <strong className="text-white">India</strong></div>
            <div>State: <strong className="text-white">Delhi NCR</strong></div>
            <div>City: <strong className="text-white">New Delhi</strong></div>
            <div>Corridor: <strong className="text-cyan-300">Inner Ring Road</strong></div>
            <div className="col-span-2 pt-1 border-t border-slate-800 text-amber-300 font-medium">
              Accident Lane: <strong>Lane 2 (Eastbound Carriageway)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
