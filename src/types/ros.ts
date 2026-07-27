import { MAX_DATA_POINTS } from '../theme/colors';

export type TabId = 'tracking' | 'sensors' | 'plotting' | 'manual' | 'settings';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

export type ToastType = 'info' | 'success' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface Telemetry {
  lat: string;
  lon: string;
  yaw: string;
  statX: string;
  statY: string;
  statYawRad: string;
  gpsMode: string;
  gpsModeClass: string;
  gpsSat: string;
  gpsHdop: string;
  leftVel: string;
  rightVel: string;
  leftCmd: string;
  rightCmd: string;
  driveState: string;
  targetWp: string;
}

export interface ChartData {
  left: [number[], number[]];
  right: [number[], number[]];
  cross: [number[]];
  along: [number[]];
  yaw: [number[], number[]];
}

export interface WaypointInput {
  x: string;
  y: string;
}

export interface SettingsForm {
  lookAhead: number;
  maxSpeed: number;
  minSpeed: number;
  maxAccel: number;
  stopDist: number;
  decelDist: number;
  kp: number;
  ki: number;
  kd: number;
  sharpTurn: number;
  steerLimit: number;
}

export interface MapState {
  roverPos: [number, number];
  plannedPath: [number, number][];
  actualTrajectory: [number, number][];
  waypointPositions: [number, number][];
  roverRotation: number;
  isNavigating: boolean;
}

export const defaultSettings: SettingsForm = {
  lookAhead: 1.4,
  maxSpeed: 1.5,
  minSpeed: 0.4,
  maxAccel: 0.5,
  stopDist: 0.8,
  decelDist: 2.0,
  kp: 0.6,
  ki: 0.0,
  kd: 0.1,
  sharpTurn: 0.8,
  steerLimit: 1.2,
};

export const defaultTelemetry: Telemetry = {
  lat: 'Đang đợi...',
  lon: 'Đang đợi...',
  yaw: '0.0',
  statX: '-',
  statY: '-',
  statYawRad: '-',
  gpsMode: 'RTK FIX',
  gpsModeClass: 'text-primary border-primary/20',
  gpsSat: '-',
  gpsHdop: '-',
  leftVel: '-',
  rightVel: '-',
  leftCmd: '-',
  rightCmd: '-',
  driveState: 'Đang chờ lệnh',
  targetWp: '0/0',
};

export function createEmptyChartData(): ChartData {
  const empty = () => Array(MAX_DATA_POINTS).fill(0) as number[];
  return {
    left: [empty(), empty()],
    right: [empty(), empty()],
    cross: [empty()],
    along: [empty()],
    yaw: [empty(), empty()],
  };
}
