import {
  ArrowDownToLine,
  CornerUpRight,
  Cpu,
  Eye,
  FastForward,
  GaugeCircle,
  Map,
  MoveHorizontal,
  Send,
  Snail,
  Target,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { SettingsForm } from '../../types/ros';

function SettingField({
  label,
  icon: Icon,
  def,
  value,
  onChange,
  step = '0.1',
}: {
  label: string;
  icon: typeof Eye;
  def: string;
  value: number;
  onChange: (v: number) => void;
  step?: string;
}) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-black text-text-main flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" /> {label}
        </label>
        <span className="text-[10px] text-text-muted font-bold bg-white px-2 py-1 rounded border border-slate-200 font-mono">
          Def: {def}
        </span>
      </div>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full p-3 bg-white text-text-main border border-slate-200 rounded-xl text-lg font-black focus:outline-none focus:border-primary shadow-inner transition font-mono"
      />
    </div>
  );
}

export function SettingsTab() {
  const { settings, setSettings, sendSettings } = useApp();

  const update = (key: keyof SettingsForm, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full flex-col overflow-y-auto p-8 md:p-12 bg-app-bg w-full custom-scrollbar flex">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="bg-panel border border-border rounded-3xl p-8 shadow-sm h-fit">
          <div className="flex items-center gap-4 mb-6 border-b-2 border-border pb-5">
            <div className="p-3 bg-blue-50 rounded-xl shadow-sm">
              <Map className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-wider">Cấu Hình LOS</h2>
              <p className="text-text-muted text-xs font-semibold mt-1">Thông số bám đường quỹ đạo</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <SettingField label="Look-ahead (m)" icon={Eye} def="1.4" value={settings.lookAhead} onChange={(v) => update('lookAhead', v)} />
            <SettingField label="Max Speed (m/s)" icon={Zap} def="1.5" value={settings.maxSpeed} onChange={(v) => update('maxSpeed', v)} />
            <SettingField label="Min Speed (m/s)" icon={Snail} def="0.4" value={settings.minSpeed} onChange={(v) => update('minSpeed', v)} />
            <SettingField label="Max Accel (m/s²)" icon={FastForward} def="0.5" value={settings.maxAccel} onChange={(v) => update('maxAccel', v)} />
            <SettingField label="Stop Distance (m)" icon={Target} def="0.8" value={settings.stopDist} onChange={(v) => update('stopDist', v)} />
            <SettingField label="Decel Dist (m)" icon={ArrowDownToLine} def="2.0" value={settings.decelDist} onChange={(v) => update('decelDist', v)} />
          </div>
        </div>

        <div className="bg-panel border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between h-fit">
          <div>
            <div className="flex items-center gap-4 mb-6 border-b-2 border-border pb-5">
              <div className="p-3 bg-blue-50 rounded-xl shadow-sm">
                <Cpu className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-wider">Điều Khiển (PID)</h2>
                <p className="text-text-muted text-xs font-semibold mt-1">Thông số tự động bám góc hướng</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <SettingField label="Kp (Tỉ lệ)" icon={GaugeCircle} def="0.6" value={settings.kp} onChange={(v) => update('kp', v)} step="0.01" />
              <SettingField label="Ki (Tích phân)" icon={GaugeCircle} def="0.0" value={settings.ki} onChange={(v) => update('ki', v)} step="0.01" />
              <SettingField label="Kd (Đạo hàm)" icon={GaugeCircle} def="0.1" value={settings.kd} onChange={(v) => update('kd', v)} step="0.01" />
              <SettingField label="Sharp Turn (rad)" icon={CornerUpRight} def="0.8" value={settings.sharpTurn} onChange={(v) => update('sharpTurn', v)} />
              <SettingField label="Steer Limit (m/s)" icon={MoveHorizontal} def="1.2" value={settings.steerLimit} onChange={(v) => update('steerLimit', v)} />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={sendSettings}
            className="w-full py-4 mt-2 bg-primary hover:bg-primary-hover text-white font-black rounded-xl transition-all shadow-md flex justify-center items-center gap-3 text-sm active:scale-95 tracking-widest uppercase"
          >
            <Send className="w-5 h-5" />
            Gửi Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
}
