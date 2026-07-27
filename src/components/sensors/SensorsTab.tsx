import { Gauge, MapPin, Navigation2, Satellite, Settings2, Truck, Unlock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';

const dataCell = "flex flex-col items-center justify-center gap-1 text-center";
const dataLabel = "text-[9px] font-black uppercase tracking-widest";
const dataValue = "text-xl font-black font-mono grad-text";

export function SensorsTab() {
  const { telemetry } = useApp();

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar w-full" style={{ background: '#f1f5f9' }}>
      <div className="max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
          <div>
            <h1 className="text-2xl font-black tracking-widest uppercase grad-text">Robot Status</h1>
            <p className="text-xs font-semibold mt-1" style={{ color: '#475569' }}>
              Theo dõi trạng thái cảm biến & hệ thống
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.28)', color: '#059669' }}>
            <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#10b981', display: 'inline-block' }} />
            SYSTEM ACTIVE
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <StatCard title="Odometry" icon={Navigation2}>
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className={dataCell}>
                <span className={dataLabel} style={{ color: '#475569' }}>X (m)</span>
                <span className={dataValue}>{telemetry.statX}</span>
              </div>
              <div className={dataCell} style={{ borderLeft: '1px solid rgba(99,102,241,0.15)', borderRight: '1px solid rgba(99,102,241,0.15)' }}>
                <span className={dataLabel} style={{ color: '#475569' }}>Y (m)</span>
                <span className={dataValue}>{telemetry.statY}</span>
              </div>
              <div className={dataCell}>
                <span className={dataLabel} style={{ color: '#475569' }}>Yaw (rad)</span>
                <span className="text-xl font-black font-mono" style={{ color: '#94a3b8' }}>{telemetry.statYawRad}</span>
              </div>
            </div>
          </StatCard>

          <StatCard title="GPS / GNSS" icon={Satellite}>
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className={dataCell}>
                <span className={dataLabel} style={{ color: '#475569' }}>Fix Mode</span>
                <span className={`text-[10px] font-black tracking-wider px-1.5 py-1 rounded-lg ${telemetry.gpsModeClass}`}
                  style={{ border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: '9px', letterSpacing: '0.05em' }}>
                  {telemetry.gpsMode}
                </span>
              </div>
              <div className={dataCell} style={{ borderLeft: '1px solid rgba(99,102,241,0.15)', borderRight: '1px solid rgba(99,102,241,0.15)' }}>
                <span className={dataLabel} style={{ color: '#475569' }}>Satellites</span>
                <span className={dataValue}>{telemetry.gpsSat}</span>
              </div>
              <div className={dataCell}>
                <span className={dataLabel} style={{ color: '#475569' }}>HDOP</span>
                <span className={dataValue}>{telemetry.gpsHdop}</span>
              </div>
            </div>
          </StatCard>

          <StatCard title="Encoder (Thực)" icon={Gauge}>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className={dataCell}>
                <span className={dataLabel} style={{ color: '#475569' }}>Trái (m/s)</span>
                <span className={dataValue}>{telemetry.leftVel}</span>
              </div>
              <div className={dataCell} style={{ borderLeft: '1px solid rgba(99,102,241,0.15)' }}>
                <span className={dataLabel} style={{ color: '#475569' }}>Phải (m/s)</span>
                <span className={dataValue}>{telemetry.rightVel}</span>
              </div>
            </div>
          </StatCard>

          <StatCard title="Cmd_vel (Lệnh)" icon={Settings2}>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className={dataCell}>
                <span className={dataLabel} style={{ color: '#475569' }}>Trái (m/s)</span>
                <span className="text-xl font-black font-mono" style={{ color: '#94a3b8' }}>{telemetry.leftCmd}</span>
              </div>
              <div className={dataCell} style={{ borderLeft: '1px solid rgba(99,102,241,0.15)' }}>
                <span className={dataLabel} style={{ color: '#475569' }}>Phải (m/s)</span>
                <span className="text-xl font-black font-mono" style={{ color: '#94a3b8' }}>{telemetry.rightCmd}</span>
              </div>
            </div>
          </StatCard>
        </div>

        {/* Bottom status cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: Unlock,
              label: 'Bảo Mật Hệ Thống',
              value: 'Đã mở khóa',
              valueColor: '#34d399',
              accent: '#10b981',
            },
            {
              icon: Truck,
              label: 'Trạng Thái Xe',
              value: telemetry.driveState,
              valueColor: '#818cf8',
              accent: '#6366f1',
            },
            {
              icon: MapPin,
              label: 'Tiến Độ Dẫn Đường',
              value: telemetry.targetWp,
              valueColor: '#22d3ee',
              accent: '#06b6d4',
            },
          ].map(({ icon: Icon, label, value, valueColor, accent }) => (
            <div key={label} className="rounded-2xl p-5 flex items-center gap-4 card-glow"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(99,102,241,0.06)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `rgba(${accent === '#10b981' ? '16,185,129' : accent === '#6366f1' ? '99,102,241' : '6,182,212'},0.1)`, border: `1px solid rgba(${accent === '#10b981' ? '16,185,129' : accent === '#6366f1' ? '99,102,241' : '6,182,212'},0.22)` }}>
                <Icon className="w-5 h-5" style={{ color: accent }} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>{label}</div>
                <div className="text-base font-black font-mono tracking-wide" style={{ color: valueColor === '#818cf8' ? '#6366f1' : valueColor === '#22d3ee' ? '#0891b2' : valueColor }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
