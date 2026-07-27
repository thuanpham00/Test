import { divIcon } from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { REF_LAT, REF_LON } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

const baseIcon = divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="26" height="26">
    <circle cx="50" cy="50" r="44" fill="#0d1424" stroke="#6366f1" stroke-width="7" opacity="0.95"/>
    <circle cx="50" cy="50" r="14" fill="#6366f1"/>
    <text x="50" y="84" font-size="24" text-anchor="middle" fill="#818cf8" font-family="Montserrat" font-weight="900">B</text>
  </svg>`,
  className: 'base-icon drop-shadow-md',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -13],
});

function createRoverIcon(rotation: number) {
  return divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="18" height="18" style="transform: rotate(${rotation}deg)">
      <defs>
        <radialGradient id="rg" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#06b6d4"/>
          <stop offset="100%" stop-color="#6366f1"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#rg)" stroke="#ffffff" stroke-width="7"/>
    </svg>`,
    className: 'rover-icon drop-shadow-xl',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function createWaypointIcon(label: number | string) {
  return divIcon({
    className: 'wp-label',
    html: `<div style="background:linear-gradient(135deg,#6366f1,#06b6d4);color:#ffffff;border-radius:50%;width:22px;height:22px;text-align:center;line-height:18px;font-size:9px;border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 12px rgba(99,102,241,0.6);font-family:Montserrat;font-weight:900;">${label}</div>`,
    iconAnchor: [11, 11],
  });
}

function MapResizeHandler({ active }: { active: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => map.invalidateSize(), 100);
      return () => clearTimeout(timer);
    }
  }, [active, map]);
  return null;
}

export function MapView({ active }: { active: boolean }) {
  const { mapState } = useApp();

  return (
    <div className="flex-1 relative h-full z-0" style={{ background: '#0a0f1a' }}>
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
        <Marker position={[REF_LAT, REF_LON]} icon={baseIcon} zIndexOffset={800} />
        <Marker position={mapState.roverPos} icon={createRoverIcon(mapState.roverRotation)} zIndexOffset={1000} />
        {mapState.waypointPositions.map((pos, index) => (
          <Marker key={`wp-${index}`} position={pos} icon={createWaypointIcon(index)} />
        ))}
        {mapState.plannedPath.length > 1 && (
          <Polyline
            positions={mapState.plannedPath}
            pathOptions={{ color: '#818cf8', dashArray: '6, 5', weight: 2.5, opacity: 0.9 }}
          />
        )}
        {mapState.actualTrajectory.length > 1 && (
          <Polyline
            positions={mapState.actualTrajectory}
            pathOptions={{ color: '#06b6d4', weight: 2.5, opacity: 0.95 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
