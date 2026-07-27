import {
  Cpu, Hexagon, Map, Navigation, Power, Sliders, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import type { TabId } from '../../types/ros';

const navItems: { id: TabId; label: string; icon: typeof Map }[] = [
  { id: 'tracking',  label: 'Tracking',     icon: Map },
  { id: 'sensors',   label: 'Robot Status', icon: Cpu },
  { id: 'plotting',  label: 'Charts',       icon: TrendingUp },
  { id: 'manual',    label: 'Manual Drive', icon: Navigation },
  { id: 'settings',  label: 'Settings',     icon: Sliders },
];

export function Sidebar() {
  const { logout } = useAuth();
  const { activeTab, setActiveTab, stopSimulation } = useApp();

  const handleLogout = () => { stopSimulation(); logout(); };

  return (
    <aside
      className="flex flex-col justify-between py-6 shrink-0"
      style={{
        width: '220px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        boxShadow: '2px 0 12px rgba(99,102,241,0.05)',
      }}
    >
      <div>
        {/* Logo */}
        <div className="px-5 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}>
            <Hexagon className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg tracking-widest grad-text uppercase">HCMUT</span>
        </div>

        {/* Label */}
        <div className="px-5 mb-2">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#cbd5e1' }}>Navigation</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all"
                style={isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.06))',
                      border: '1px solid rgba(99,102,241,0.22)',
                      color: '#6366f1',
                      fontWeight: 700,
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: '#94a3b8',
                      fontWeight: 600,
                    }
                }
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.05)'; (e.currentTarget as HTMLElement).style.color = '#6366f1'; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; } }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="tracking-wide">{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-4 pt-4 mt-4" style={{ borderTop: '1px solid #f1f5f9' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] font-black tracking-widest uppercase mb-0.5" style={{ color: '#cbd5e1' }}>Active Session</div>
            <div className="text-sm font-bold" style={{ color: '#64748b' }}>Administrator</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-lg transition-all"
            style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.15)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.07)')}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
