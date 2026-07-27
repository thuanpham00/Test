import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import * as ROSLIB from 'roslib';
import {
  REF_LAT,
  REF_LON,
  UPDATE_DIST_THRESHOLD,
  UPDATE_YAW_THRESHOLD,
} from '../theme/colors';
import {
  createEmptyChartData,
  defaultSettings,
  defaultTelemetry,
  type ChartData,
  type ConnectionStatus,
  type MapState,
  type SettingsForm,
  type TabId,
  type Telemetry,
  type Toast,
  type ToastType,
} from '../types/ros';
import { convertXYToLatLon, yawFromQuaternion } from '../utils/coordinates';
import { pushChartValue } from '../hooks/useChartBuffer';

interface AppContextValue {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  wsUrl: string;
  setWsUrl: (url: string) => void;
  connectionStatus: ConnectionStatus;
  telemetry: Telemetry;
  chartData: ChartData;
  msgCount: number;
  mapState: MapState;
  settings: SettingsForm;
  setSettings: React.Dispatch<React.SetStateAction<SettingsForm>>;
  toasts: Toast[];
  showNotification: (message: string, type?: ToastType) => void;
  connectROS: () => void;
  sendSettings: () => void;
  sendManualWaypoints: (wp1: { x: number; y: number }, wp2: { x: number; y: number }, wp3: { x: number; y: number }) => void;
  clearWaypoints: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  isRosConnected: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const initialRoverPos: [number, number] = [REF_LAT + 0.00001, REF_LON + 0.00001];

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('tracking');
  const [wsUrl, setWsUrl] = useState('ws://192.168.1.124:9090');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [telemetry, setTelemetry] = useState<Telemetry>(defaultTelemetry);
  const [chartData, setChartData] = useState<ChartData>(createEmptyChartData);
  const [msgCount, setMsgCount] = useState(0);
  const [settings, setSettings] = useState<SettingsForm>(defaultSettings);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mapState, setMapState] = useState<MapState>({
    roverPos: initialRoverPos,
    plannedPath: [],
    actualTrajectory: [],
    waypointPositions: [],
    roverRotation: 0,
    isNavigating: false,
  });

  const rosRef = useRef<ROSLIB.Ros | null>(null);
  const pathTopicRef = useRef<ROSLIB.Topic | null>(null);
  const settingsTopicRef = useRef<ROSLIB.Topic | null>(null);
  const simulationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastYawDegRef = useRef<number | null>(null);
  const currentRoverPosRef = useRef<[number, number]>(initialRoverPos);
  const simPosRef = useRef<[number, number]>([REF_LAT + 0.00005, REF_LON + 0.00005]);
  const simYawRef = useRef(0);
  const simWaypointsRef = useRef<[number, number][]>([]);
  const simCurrentWpIndexRef = useRef(0);
  const simSpeedRef = useRef(0.000008);
  const isNavigatingRef = useRef(false);
  const actualTrajectoryRef = useRef<[number, number][]>([]);

  const isRosConnected = connectionStatus === 'connected';

  const showNotification = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const updateChart = useCallback((updater: (prev: ChartData) => ChartData) => {
    setChartData(updater);
  }, []);

  const updateMapState = useCallback((partial: Partial<MapState>) => {
    setMapState((prev) => ({ ...prev, ...partial }));
  }, []);

  const stopSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  }, []);

  const setupSubscribers = useCallback(
    (ros: ROSLIB.Ros) => {
      const gpsSub = new ROSLIB.Topic({ ros, name: '/gps/raw', messageType: 'std_msgs/String' });
      gpsSub.subscribe((msg: { data: string }) => {
        const parts = msg.data.split(',');
        if (parts.length === 2) {
          const lat = parseFloat(parts[0]);
          const lon = parseFloat(parts[1]);
          const newLatLng = { lat, lng: lon };
          const current = currentRoverPosRef.current;
          const dist =
            Math.hypot(
              (newLatLng.lat - current[0]) * 110574,
              (newLatLng.lng - current[1]) * 111320 * Math.cos((current[0] * Math.PI) / 180),
            );

          if (actualTrajectoryRef.current.length === 0 || dist > UPDATE_DIST_THRESHOLD) {
            setTelemetry((prev) => ({
              ...prev,
              lat: lat.toFixed(7),
              lon: lon.toFixed(7),
            }));
            currentRoverPosRef.current = [lat, lon];
            actualTrajectoryRef.current = [...actualTrajectoryRef.current, [lat, lon]];
            updateMapState({
              roverPos: [lat, lon],
              actualTrajectory: actualTrajectoryRef.current,
            });
          }
        }
      });

      const gpsFixSub = new ROSLIB.Topic({ ros, name: '/gps_fix', messageType: 'std_msgs/Int32' });
      gpsFixSub.subscribe((msg: { data: number }) => {
        let modeStr = 'NO FIX';
        let modeClass = 'text-textMuted border-slate-200';
        switch (msg.data) {
          case 1:
            modeStr = 'GPS FIX';
            modeClass = 'text-primary border-primary/20';
            break;
          case 2:
            modeStr = 'DGPS FIX';
            modeClass = 'text-success border-success/20';
            break;
          case 4:
            modeStr = 'RTK FIX';
            modeClass = 'text-primary border-primary/20';
            break;
          case 5:
            modeStr = 'RTK FLOAT';
            modeClass = 'text-textMuted border-slate-200';
            break;
        }
        setTelemetry((prev) => ({ ...prev, gpsMode: modeStr, gpsModeClass: modeClass }));
      });

      const gpsSatSub = new ROSLIB.Topic({ ros, name: '/gps_sat', messageType: 'std_msgs/Int32' });
      gpsSatSub.subscribe((msg: { data: number }) => {
        setTelemetry((prev) => ({ ...prev, gpsSat: String(msg.data) }));
      });

      const gpsHdopSub = new ROSLIB.Topic({ ros, name: '/gps_hdop', messageType: 'std_msgs/Float64' });
      gpsHdopSub.subscribe((msg: { data: number }) => {
        setTelemetry((prev) => ({ ...prev, gpsHdop: msg.data.toFixed(2) }));
      });

      const odomSub = new ROSLIB.Topic({ ros, name: '/odometry/filtered', messageType: 'nav_msgs/Odometry' });
      odomSub.subscribe((msg: { pose: { pose: { position: { x: number; y: number }; orientation: { x: number; y: number; z: number; w: number } } } }) => {
        const yawRad = yawFromQuaternion(msg.pose.pose.orientation);
        const yawDeg = yawRad * (180.0 / Math.PI);

        setTelemetry((prev) => ({
          ...prev,
          statX: msg.pose.pose.position.x.toFixed(2),
          statY: msg.pose.pose.position.y.toFixed(2),
          statYawRad: yawRad.toFixed(2),
        }));

        updateChart((prev) => ({
          ...prev,
          yaw: [pushChartValue(prev.yaw[0], yawDeg), prev.yaw[1]],
        }));

        if (lastYawDegRef.current === null || Math.abs(yawDeg - lastYawDegRef.current) > UPDATE_YAW_THRESHOLD) {
          lastYawDegRef.current = yawDeg;
          setTelemetry((prev) => ({ ...prev, yaw: yawDeg.toFixed(1) }));
          updateMapState({ roverRotation: 90 - yawDeg });
        }
      });

      const leftVelSub = new ROSLIB.Topic({ ros, name: '/left_vel', messageType: 'std_msgs/Float64' });
      leftVelSub.subscribe((msg: { data: number }) => {
        setTelemetry((prev) => ({ ...prev, leftVel: msg.data.toFixed(2) }));
        updateChart((prev) => ({
          ...prev,
          left: [pushChartValue(prev.left[0], msg.data), prev.left[1]],
        }));
      });

      const rightVelSub = new ROSLIB.Topic({ ros, name: '/right_vel', messageType: 'std_msgs/Float64' });
      rightVelSub.subscribe((msg: { data: number }) => {
        setTelemetry((prev) => ({ ...prev, rightVel: msg.data.toFixed(2) }));
        updateChart((prev) => ({
          ...prev,
          right: [pushChartValue(prev.right[0], msg.data), prev.right[1]],
        }));
      });

      const leftCmdSub = new ROSLIB.Topic({ ros, name: '/left_vel_cmd', messageType: 'std_msgs/Float64' });
      leftCmdSub.subscribe((msg: { data: number }) => {
        setTelemetry((prev) => ({ ...prev, leftCmd: msg.data.toFixed(2) }));
        updateChart((prev) => ({
          ...prev,
          left: [prev.left[0], pushChartValue(prev.left[1], msg.data)],
        }));
      });

      const rightCmdSub = new ROSLIB.Topic({ ros, name: '/right_vel_cmd', messageType: 'std_msgs/Float64' });
      rightCmdSub.subscribe((msg: { data: number }) => {
        setTelemetry((prev) => ({ ...prev, rightCmd: msg.data.toFixed(2) }));
        updateChart((prev) => ({
          ...prev,
          right: [prev.right[0], pushChartValue(prev.right[1], msg.data)],
        }));
      });

      const desiredHeadingSub = new ROSLIB.Topic({ ros, name: '/desired_heading', messageType: 'std_msgs/Float64' });
      desiredHeadingSub.subscribe((msg: { data: number }) => {
        const desiredYawDeg = msg.data * (180.0 / Math.PI);
        updateChart((prev) => ({
          ...prev,
          yaw: [prev.yaw[0], pushChartValue(prev.yaw[1], desiredYawDeg)],
        }));
      });

      const cteSub = new ROSLIB.Topic({ ros, name: '/cross_track_error', messageType: 'std_msgs/Float64' });
      cteSub.subscribe((msg: { data: number }) => {
        updateChart((prev) => ({
          ...prev,
          cross: [pushChartValue(prev.cross[0], msg.data)],
        }));
      });

      const atdSub = new ROSLIB.Topic({ ros, name: '/along_track_distance', messageType: 'std_msgs/Float64' });
      atdSub.subscribe((msg: { data: number }) => {
        updateChart((prev) => ({
          ...prev,
          along: [pushChartValue(prev.along[0], msg.data)],
        }));
      });

      pathTopicRef.current = new ROSLIB.Topic({ ros, name: '/web_path', messageType: 'nav_msgs/Path' });
      settingsTopicRef.current = new ROSLIB.Topic({ ros, name: '/web_settings', messageType: 'std_msgs/String' });
    },
    [updateChart, updateMapState],
  );

  const connectROS = useCallback(() => {
    if (rosRef.current) rosRef.current.close();

    setConnectionStatus('connecting');

    const ros = new ROSLIB.Ros({ url: wsUrl });
    rosRef.current = ros;

    ros.on('connection', () => {
      stopSimulation();
      setConnectionStatus('connected');
      setupSubscribers(ros);
      showNotification('Kết nối ROS 2 Server thành công!', 'success');
    });

    ros.on('error', () => {
      setConnectionStatus('error');
      showNotification('Lỗi kết nối WebSockets!', 'warning');
    });

    ros.on('close', () => {
      setConnectionStatus('idle');
    });
  }, [setupSubscribers, showNotification, stopSimulation, wsUrl]);

  const sendSettings = useCallback(() => {
    const {
      lookAhead,
      maxSpeed,
      minSpeed,
      maxAccel,
      stopDist,
      decelDist,
      kp,
      ki,
      kd,
      sharpTurn,
      steerLimit,
    } = settings;

    if (
      [lookAhead, maxSpeed, minSpeed, maxAccel, stopDist, decelDist, kp, ki, kd, sharpTurn, steerLimit].some(
        (v) => Number.isNaN(v),
      )
    ) {
      showNotification('Please fill in all valid parameters!', 'warning');
      return;
    }

    simSpeedRef.current = Math.min(0.0001, maxSpeed * 0.000005);

    if (!rosRef.current || !rosRef.current.isConnected) {
      showNotification('ROS 2 not connected! Saved locally to Simulator.', 'info');
      return;
    }

    const configPayload = {
      look_ahead: lookAhead,
      max_speed: maxSpeed,
      min_speed: minSpeed,
      max_accel: maxAccel,
      stop_distance: stopDist,
      decel_distance: decelDist,
      pid_kp: kp,
      pid_ki: ki,
      pid_kd: kd,
      sharp_turn_angle: sharpTurn,
      steer_limit: steerLimit,
    };

    settingsTopicRef.current?.publish(new ROSLIB.Message({ data: JSON.stringify(configPayload) }));
    showNotification('Parameters sent successfully to the Robot!', 'success');
  }, [settings, showNotification]);

  const clearWaypoints = useCallback(() => {
    isNavigatingRef.current = false;
    simWaypointsRef.current = [];
    actualTrajectoryRef.current = [];
    updateMapState({
      plannedPath: [],
      actualTrajectory: [],
      waypointPositions: [],
      isNavigating: false,
    });
  }, [updateMapState]);

  const sendManualWaypoints = useCallback(
    (wp1: { x: number; y: number }, wp2: { x: number; y: number }, wp3: { x: number; y: number }) => {
      clearWaypoints();

      const ptsXY = [wp1, wp2, wp3];
      const selectedWaypoints = ptsXY.map((pt) => convertXYToLatLon(pt.x, pt.y));
      const roverPos = currentRoverPosRef.current;

      updateMapState({
        waypointPositions: [roverPos, ...selectedWaypoints],
        plannedPath: [roverPos, ...selectedWaypoints],
        isNavigating: true,
        actualTrajectory: [],
      });
      isNavigatingRef.current = true;
      actualTrajectoryRef.current = [];

      if (!rosRef.current || !rosRef.current.isConnected) {
        showNotification('Offline mode: Lộ trình đã lưu, bắt đầu mô phỏng!', 'info');
        simWaypointsRef.current = [...selectedWaypoints];
        simCurrentWpIndexRef.current = 0;
        return;
      }

      const pathMsg = new ROSLIB.Message({
        header: { frame_id: 'odom' },
        poses: ptsXY.map((p) => ({
          pose: {
            position: { x: p.x, y: p.y, z: 0.0 },
            orientation: { x: 0, y: 0, z: 0, w: 1 },
          },
        })),
      });

      pathTopicRef.current?.publish(pathMsg);
      showNotification('Lập kế hoạch thành công! Đã gửi 3 điểm Waypoint xuống xe.', 'success');
    },
    [clearWaypoints, showNotification, updateMapState],
  );

  const startSimulation = useCallback(() => {
    if (simulationIntervalRef.current) return;

    let sLvel = 0.5;
    let sRvel = 0.5;
    let sCte = 0.1;
    let sAtd = 5.0;
    let sDes = 0.0;

    simulationIntervalRef.current = setInterval(() => {
      setMsgCount((c) => c + 1);

      const simWaypoints = simWaypointsRef.current;
      const simPos = simPosRef.current;

      if (simWaypoints.length > 0 && simCurrentWpIndexRef.current < simWaypoints.length) {
        const target = simWaypoints[simCurrentWpIndexRef.current];
        const dy = target[0] - simPos[0];
        const dx = target[1] - simPos[1];
        const dist = Math.hypot(dx, dy);
        const targetYaw = Math.atan2(dy, dx);

        simYawRef.current += (targetYaw - simYawRef.current) * 0.1;
        sDes = targetYaw * (180 / Math.PI);

        if (dist < 0.00003) {
          simCurrentWpIndexRef.current += 1;
          setTelemetry((prev) => ({
            ...prev,
            targetWp: `${Math.min(simCurrentWpIndexRef.current + 1, simWaypoints.length)}/${simWaypoints.length}`,
          }));
          if (simCurrentWpIndexRef.current >= simWaypoints.length) {
            simWaypointsRef.current = [];
            setTelemetry((prev) => ({ ...prev, driveState: 'ĐÃ ĐẾN ĐÍCH' }));
            sLvel = 0;
            sRvel = 0;
          }
        } else {
          simPos[0] += Math.sin(simYawRef.current) * simSpeedRef.current;
          simPos[1] += Math.cos(simYawRef.current) * simSpeedRef.current;
          setTelemetry((prev) => ({ ...prev, driveState: 'ĐANG DI CHUYỂN' }));
        }
      }

      const simYawDeg = simYawRef.current * (180 / Math.PI);
      currentRoverPosRef.current = [...simPos] as [number, number];

      setMapState((prev) => {
        const actualTrajectory = isNavigatingRef.current
          ? [...actualTrajectoryRef.current, [...simPos] as [number, number]]
          : prev.actualTrajectory;
        if (isNavigatingRef.current) {
          actualTrajectoryRef.current = actualTrajectory;
        }
        return {
          ...prev,
          roverPos: [...simPos] as [number, number],
          roverRotation: 90 - simYawDeg,
          actualTrajectory,
        };
      });

      setTelemetry((prev) => ({
        ...prev,
        lat: simPos[0].toFixed(7),
        lon: simPos[1].toFixed(7),
        yaw: simYawDeg.toFixed(1),
        statX: ((simPos[1] - REF_LON) * 111320).toFixed(2),
        statY: ((simPos[0] - REF_LAT) * 110574).toFixed(2),
        statYawRad: simYawRef.current.toFixed(2),
      }));

      if (simWaypoints.length > 0) {
        sLvel += (Math.random() - 0.5) * 0.1;
        sRvel += (Math.random() - 0.5) * 0.1;
        sLvel = Math.max(0.2, Math.min(0.8, sLvel));
        sRvel = Math.max(0.2, Math.min(0.8, sRvel));
        sCte += (Math.random() - 0.5) * 0.05;
        sAtd -= 0.05;
      } else {
        sLvel = 0;
        sRvel = 0;
        sCte = 0;
      }

      if (!rosRef.current || !rosRef.current.isConnected) {
        setTelemetry((prev) => ({
          ...prev,
          leftVel: sLvel.toFixed(2),
          rightVel: sRvel.toFixed(2),
          leftCmd: (sLvel + 0.05).toFixed(2),
          rightCmd: (sRvel + 0.05).toFixed(2),
        }));

        updateChart((prev) => ({
          left: [pushChartValue(prev.left[0], sLvel), pushChartValue(prev.left[1], sLvel + Math.random() * 0.1)],
          right: [pushChartValue(prev.right[0], sRvel), pushChartValue(prev.right[1], sRvel + Math.random() * 0.1)],
          cross: [pushChartValue(prev.cross[0], sCte)],
          along: [pushChartValue(prev.along[0], sAtd > 0 ? sAtd : 0)],
          yaw: [pushChartValue(prev.yaw[0], simYawDeg), pushChartValue(prev.yaw[1], sDes)],
        }));
      }
    }, 200);
  }, [updateChart]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      wsUrl,
      setWsUrl,
      connectionStatus,
      telemetry,
      chartData,
      msgCount,
      mapState,
      settings,
      setSettings,
      toasts,
      showNotification,
      connectROS,
      sendSettings,
      sendManualWaypoints,
      clearWaypoints,
      startSimulation,
      stopSimulation,
      isRosConnected,
    }),
    [
      activeTab,
      wsUrl,
      connectionStatus,
      telemetry,
      chartData,
      msgCount,
      mapState,
      settings,
      toasts,
      showNotification,
      connectROS,
      sendSettings,
      sendManualWaypoints,
      clearWaypoints,
      startSimulation,
      stopSimulation,
      isRosConnected,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
