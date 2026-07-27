import {
  Cpu,
  Hexagon,
  Map,
  Navigation,
  Power,
  Sliders,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import type { TabId } from '../../types/ros';

const navItems: { id: TabId; label: string; icon: typeof Map }[] = [
  { id: 'tracking', label: 'Tracking', icon: Map },
  { id: 'sensors', label: 'Robot Status', icon: Cpu },
  { id: 'plotting', label: 'Chart', icon: TrendingUp },
  { id: 'manual', label: 'Manual Drive', icon: Navigation },
  { id: 'settings', label: 'Setting', icon: Sliders },
];

export function Sidebar() {
  const { logout } = useAuth();
  const { activeTab, setActiveTab, stopSimulation } = useApp();

  const handleLogout = () => {
    stopSimulation();
    logout();
  };

  return (
    <aside className="w-[260px] bg-panel flex flex-col justify-between py-6 border-r border-border shadow-sm z-[1001]">
      <div>
        <div className="px-6 mb-10 flex items-center gap-3">
          <Hexagon className="w-7 h-7 text-primary" />
          <span className="font-black text-xl tracking-wider text-text-main uppercase">HCMUT</span>
        </div>

        <nav className="flex flex-col gap-2 pr-4 pl-2">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`w-full text-left px-5 py-3.5 rounded-r-2xl text-sm tracking-wide flex items-center gap-3 transition-all ${
                  isActive
                    ? 'font-bold text-primary bg-blue-50 border-l-4 border-primary shadow-sm'
                    : 'font-semibold text-text-muted hover:text-primary hover:bg-blue-50/50 border-l-4 border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-6 pt-6 border-t border-border mt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-text-muted font-black tracking-widest uppercase mb-1">
              Phiên đăng nhập
            </div>
            <div className="text-sm font-bold text-text-main">Administrator</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 bg-slate-100 hover:bg-error hover:text-white text-slate-500 rounded-full transition-colors shadow-sm"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
