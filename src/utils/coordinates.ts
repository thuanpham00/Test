import { REF_LAT, REF_LON } from '../theme/colors';

export function convertXYToLatLon(x: number, y: number): [number, number] {
  const R = 6378137.0;
  const dLat = y / R;
  const dLon = x / (R * Math.cos((REF_LAT * Math.PI) / 180.0));
  const lat = REF_LAT + (dLat * 180.0) / Math.PI;
  const lon = REF_LON + (dLon * 180.0) / Math.PI;
  return [lat, lon];
}

export function yawFromQuaternion(q: { x: number; y: number; z: number; w: number }): number {
  const sinyCosp = 2 * (q.w * q.z + q.x * q.y);
  const cosyCosp = 1 - 2 * (q.y * q.y + q.z * q.z);
  return Math.atan2(sinyCosp, cosyCosp);
}
