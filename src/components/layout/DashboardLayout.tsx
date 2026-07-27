import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';
import { TrackingTab } from '../tracking/TrackingTab';
import { SensorsTab } from '../sensors/SensorsTab';
import { PlottingTab } from '../plotting/PlottingTab';
import { ManualTab } from '../manual/ManualTab';
import { SettingsTab } from '../settings/SettingsTab';

export function DashboardLayout() {
  const { activeTab } = useApp();

  return (
    <div className="h-screen w-screen flex bg-app-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-app-bg relative">
        {activeTab === 'tracking' && <TrackingTab active />}
        {activeTab === 'sensors' && <SensorsTab />}
        {activeTab === 'plotting' && <PlottingTab active={activeTab === 'plotting'} />}
        {activeTab === 'manual' && <ManualTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}
