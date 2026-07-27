import { Gauge, MapPin, Navigation2, Satellite, Settings2, Truck, Unlock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';

export function SensorsTab() {
  const { telemetry } = useApp();

  return (
    <div className="h-full flex-col overflow-y-auto p-8 md:p-12 bg-app-bg custom-scrollbar w-full flex">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-border">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-text-main tracking-wider uppercase">Robot Status</h1>
            <p className="text-text-muted text-sm font-semibold">Theo dõi trạng thái của các cảm biến</p>
          </div>
          <span className="bg-white border border-primary/30 text-primary shadow-sm text-xs font-black px-4 py-2 rounded-full flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
            SYSTEM ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Odometry (Vị trí & hướng)" icon={Navigation2}>
            <div className="grid grid-cols-3 gap-4 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Tọa độ X (m)</span>
                <span className="text-2xl font-black text-primary font-mono">{telemetry.statX}</span>
              </div>
              <div className="border-l border-r border-slate-200">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Tọa độ Y (m)</span>
                <span className="text-2xl font-black text-primary font-mono">{telemetry.statY}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Góc Yaw (rad)</span>
                <span className="text-2xl font-bold text-text-main font-mono">{telemetry.statYawRad}</span>
              </div>
            </div>
          </StatCard>

          <StatCard title="Tín hiệu GPS/GNSS" icon={Satellite}>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100 items-center h-[88px]">
              <div className="flex flex-col justify-center">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Chế độ Fix</span>
                <span className={`text-[11px] font-black tracking-widest font-mono bg-white px-1 py-1 rounded shadow-sm border block truncate ${telemetry.gpsModeClass}`}>
                  {telemetry.gpsMode}
                </span>
              </div>
              <div className="border-l border-slate-200 flex flex-col justify-center">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Vệ Tinh</span>
                <span className="text-2xl font-black text-text-main font-mono">{telemetry.gpsSat}</span>
              </div>
              <div className="border-l border-slate-200 flex flex-col justify-center">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">HDOP</span>
                <span className="text-2xl font-black text-text-main font-mono">{telemetry.gpsHdop}</span>
              </div>
            </div>
          </StatCard>

          <StatCard title="Encoder (Vận tốc thực)" icon={Gauge}>
            <div className="grid grid-cols-2 gap-4 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="border-r border-slate-200">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Bánh Trái (m/s)</span>
                <span className="text-2xl font-black text-primary font-mono">{telemetry.leftVel}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Bánh Phải (m/s)</span>
                <span className="text-2xl font-black text-primary font-mono">{telemetry.rightVel}</span>
              </div>
            </div>
          </StatCard>

          <StatCard title="Cmd_vel (Lệnh điều khiển)" icon={Settings2}>
            <div className="grid grid-cols-2 gap-4 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="border-r border-slate-200">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Lệnh Trái (m/s)</span>
                <span className="text-2xl font-black text-text-main font-mono">{telemetry.leftCmd}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block mb-1">Lệnh Phải (m/s)</span>
                <span className="text-2xl font-black text-text-main font-mono">{telemetry.rightCmd}</span>
              </div>
            </div>
          </StatCard>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="bg-slate-900 rounded-2xl p-5 shadow-lg flex flex-col justify-between border border-slate-700">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Bảo mật hệ thống</span>
              <div className="flex items-center gap-3 text-white font-bold text-lg">
                <div className="p-2 bg-primary/20 rounded-full">
                  <Unlock className="w-5 h-5 text-primary-light" />
                </div>
                <span className="tracking-wide">Đã mở khóa</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-5 shadow-lg flex flex-col justify-between border border-slate-700">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Trạng thái xe</span>
              <div className="flex items-center gap-3 text-white font-bold text-lg">
                <div className="p-2 bg-primary/20 rounded-full">
                  <Truck className="w-5 h-5 text-primary-light" />
                </div>
                <span className="uppercase tracking-widest text-sm text-primary-light">{telemetry.driveState}</span>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-5 shadow-lg flex flex-col justify-between border border-slate-700">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tiến độ dẫn đường</span>
              <div className="flex items-center gap-3 text-white font-bold text-lg">
                <div className="p-2 bg-primary/20 rounded-full">
                  <MapPin className="w-5 h-5 text-primary-light" />
                </div>
                <span className="font-mono text-primary-light tracking-wider text-xl">{telemetry.targetWp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
