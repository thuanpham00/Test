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
  label, icon: Icon, def, value, onChange, step = '0.1',
}: {
  label: string;
  icon: typeof Eye;
  def: string;
  value: number;
  onChange: (v: number) => void;
  step?: string;
}) {
  return (
    <div className="rounded-xl p-3 transition-all"
      style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
      onFocus={e => ((e.currentTarget as HTMLElement).style.borderColor = '#6366f1')}
      onBlur={e => ((e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0')}
    >
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold flex items-center gap-1.5" style={{ color: '#64748b' }}>
          <Icon className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
          {label}
        </label>
        <span className="text-[9px] font-black font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}>
          def: {def}
        </span>
      </div>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full p-2.5 rounded-lg text-base font-black font-mono outline-none transition-all"
        style={{ background: '#ffffff', color: '#0f172a', border: '1.5px solid #e2e8f0' }}
        onFocus={e => (e.target.style.borderColor = '#6366f1')}
        onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
      />
    </div>
  );
}

function Card({ title, icon: Icon, subtitle, children }: { title: string; icon: typeof Map; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 relative overflow-hidden"
      style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(99,102,241,0.06)' }}>
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(6,182,212,0.3), transparent)' }} />
      <div className="flex items-center gap-3 mb-5 pb-4"
        style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.07))', border: '1px solid rgba(99,102,241,0.18)' }}>
          <Icon className="w-5 h-5" style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider" style={{ color: '#0f172a' }}>{title}</h2>
          <p className="text-[10px] font-semibold mt-0.5" style={{ color: '#94a3b8' }}>{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function SettingsTab() {
  const { settings, setSettings, sendSettings } = useApp();
  const update = (key: keyof SettingsForm, value: number) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar w-full" style={{ background: '#f1f5f9' }}>
      <div className="max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="mb-6 pb-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
          <h1 className="text-2xl font-black tracking-widest uppercase grad-text">Cấu Hình Hệ Thống</h1>
          <p className="text-xs font-semibold mt-1" style={{ color: '#475569' }}>LOS Navigation & PID Controller Parameters</p>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
          <Card title="Cấu Hình LOS" icon={Map} subtitle="Thông số bám đường quỹ đạo">
            <SettingField label="Look-ahead (m)" icon={Eye} def="1.4" value={settings.lookAhead} onChange={(v) => update('lookAhead', v)} />
            <SettingField label="Max Speed (m/s)" icon={Zap} def="1.5" value={settings.maxSpeed} onChange={(v) => update('maxSpeed', v)} />
            <SettingField label="Min Speed (m/s)" icon={Snail} def="0.4" value={settings.minSpeed} onChange={(v) => update('minSpeed', v)} />
            <SettingField label="Max Accel (m/s²)" icon={FastForward} def="0.5" value={settings.maxAccel} onChange={(v) => update('maxAccel', v)} />
            <SettingField label="Stop Distance (m)" icon={Target} def="0.8" value={settings.stopDist} onChange={(v) => update('stopDist', v)} />
            <SettingField label="Decel Dist (m)" icon={ArrowDownToLine} def="2.0" value={settings.decelDist} onChange={(v) => update('decelDist', v)} />
          </Card>

          <Card title="Điều Khiển PID" icon={Cpu} subtitle="Thông số tự động bám góc hướng">
            <SettingField label="Kp (Tỉ lệ)" icon={GaugeCircle} def="0.6" value={settings.kp} onChange={(v) => update('kp', v)} step="0.01" />
            <SettingField label="Ki (Tích phân)" icon={GaugeCircle} def="0.0" value={settings.ki} onChange={(v) => update('ki', v)} step="0.01" />
            <SettingField label="Kd (Đạo hàm)" icon={GaugeCircle} def="0.1" value={settings.kd} onChange={(v) => update('kd', v)} step="0.01" />
            <SettingField label="Sharp Turn (rad)" icon={CornerUpRight} def="0.8" value={settings.sharpTurn} onChange={(v) => update('sharpTurn', v)} />
            <SettingField label="Steer Limit (m/s)" icon={MoveHorizontal} def="1.2" value={settings.steerLimit} onChange={(v) => update('steerLimit', v)} />
          </Card>
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={sendSettings}
          className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-3 btn-grad active:scale-95"
          style={{ boxShadow: '0 0 32px rgba(99,102,241,0.25)' }}
        >
          <Send className="w-5 h-5" />
          Gửi Cấu Hình Xuống Xe
        </button>

      </div>
    </div>
  );
}
