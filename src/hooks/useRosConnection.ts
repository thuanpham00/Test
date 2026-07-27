import { useApp } from '../context/AppContext';

export function useRosConnection() {
  const { wsUrl, setWsUrl, connectionStatus, connectROS, sendSettings, sendManualWaypoints, clearWaypoints, isRosConnected } =
    useApp();
  return { wsUrl, setWsUrl, connectionStatus, connectROS, sendSettings, sendManualWaypoints, clearWaypoints, isRosConnected };
}
