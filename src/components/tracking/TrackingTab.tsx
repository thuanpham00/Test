import { ControlPanel } from './ControlPanel';
import { MapView } from './MapView';

export function TrackingTab({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col md:flex-row overflow-hidden w-full relative">
      <ControlPanel />
      <MapView active={active} />
    </div>
  );
}
