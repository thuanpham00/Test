import { useApp } from '../context/AppContext';

export function useSimulation() {
  const { startSimulation, stopSimulation, msgCount } = useApp();
  return { startSimulation, stopSimulation, msgCount };
}
