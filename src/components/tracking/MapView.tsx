import { divIcon } from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { REF_LAT, REF_LON } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const baseIcon = divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="24" height="24">
    <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#2563EB" stroke-width="8" opacity="0.9"/>
    <circle cx="50" cy="50" r="15" fill="#2563EB"/>
    <text x="50" y="85" font-size="25" text-anchor="middle" fill="#2563EB" font-family="Montserrat" font-weight="900">B</text>
  </svg>`,
  className: 'base-icon drop-shadow-md',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

function createRoverIcon(rotation: number) {
  return divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="16" height="16" style="transform: rotate(${rotation}deg)">
      <circle cx="50" cy="50" r="40" fill="#3B82F6" stroke="#ffffff" stroke-width="8"/>
    </svg>`,
    className: 'rover-icon drop-shadow-xl',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function createWaypointIcon(label: number | string) {
  return divIcon({
    className: 'wp-label',
    html: `<div style="background:#2563EB;color:#ffffff;border-radius:50%;width:20px;height:20px;text-align:center;line-height:16px;font-size:8px;border:2px solid #ffffff;box-shadow:0 0 8px rgba(37,99,235,0.5);font-family:Montserrat;font-weight:900;">${label}</div>`,
    iconAnchor: [10, 10],
  });
}

function MapResizeHandler({ active }: { active: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (active) {
      setTimeout(() => map.invalidateSize(), 100);
    }
  }, [active, map]);

  return null;
}

export function MapView({ active }: { active: boolean }) {
  const { mapState } = useApp();

  return (
    <div className="flex-1 relative h-full bg-slate-200 z-0">
      <MapContainer
        center={[REF_LAT, REF_LON]}
        zoom={20}
        zoomControl={false}
        className="w-full h-full color-map"
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          maxZoom={21}
          attribution="© Google Maps"
        />
        <MapResizeHandler active={active} />
        <Marker
          position={[REF_LAT, REF_LON]}
          icon={baseIcon}
          zIndexOffset={800}
        />
        <Marker
          position={mapState.roverPos}
          icon={createRoverIcon(mapState.roverRotation)}
          zIndexOffset={1000}
        />
        {mapState.waypointPositions.map((pos, index) => (
          <Marker key={`wp-${index}`} position={pos} icon={createWaypointIcon(index)} />
        ))}
        {mapState.plannedPath.length > 1 && (
          <Polyline
            positions={mapState.plannedPath}
            pathOptions={{ color: '#2563EB', dashArray: '5, 5', weight: 2, opacity: 0.8 }}
          />
        )}
        {mapState.actualTrajectory.length > 1 && (
          <Polyline
            positions={mapState.actualTrajectory}
            pathOptions={{ color: '#1D4ED8', weight: 2, opacity: 0.9 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
