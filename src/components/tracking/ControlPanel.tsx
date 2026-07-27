import { Activity, MapPin, Radio, Route, Send, Trash2, Wifi } from 'lucide-react';
import { useState } from 'react';
import { REF_LAT, REF_LON } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

function SectionTitle({ icon: Icon, children }: { icon: typeof Radio; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3" style={{ color: '#94a3b8' }}>
      <Icon className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
      <span className="text-[10px] font-black tracking-[0.18em] uppercase">{children}</span>
    </div>
  );
}

export function ControlPanel() {
  const {
    wsUrl, setWsUrl, connectionStatus, connectROS,
    telemetry, sendManualWaypoints, clearWaypoints, showNotification,
  } = useApp();

  const [wp1, setWp1] = useState({ x: '', y: '' });
  const [wp2, setWp2] = useState({ x: '', y: '' });
  const [wp3, setWp3] = useState({ x: '', y: '' });

  const statusConfig = {
    connected:  { text: 'Đã Kết Nối ROS 2', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.3)',  color: '#059669', dot: '#10b981' },
    error:      { text: 'Lỗi WebSockets',   bg: 'rgba(244,63,94,0.08)',   border: 'rgba(244,63,94,0.25)',  color: '#e11d48', dot: '#f43f5e' },
    connecting: { text: 'Đang kết nối…',    bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)', color: '#6366f1', dot: '#818cf8' },
    idle:       { text: 'Chưa kết nối',     bg: 'rgba(100,116,139,0.06)', border: '#e2e8f0',               color: '#94a3b8', dot: '#cbd5e1' },
  }[connectionStatus];

  const handleSendWaypoints = () => {
    const x1 = parseFloat(wp1.x), y1 = parseFloat(wp1.y);
    const x2 = parseFloat(wp2.x), y2 = parseFloat(wp2.y);
    const x3 = parseFloat(wp3.x), y3 = parseFloat(wp3.y);
    if ([x1,y1,x2,y2,x3,y3].some(Number.isNaN)) {
      showNotification('Vui lòng nhập đầy đủ tọa độ X, Y hợp lệ!', 'warning');
      return;
    }
    sendManualWaypoints({ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    background: '#f8fafc', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', color: '#0f172a',
    fontSize: '12px', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, outline: 'none',
  };
  const smallInputStyle: React.CSSProperties = {
    ...inputStyle, padding: '7px 9px', fontSize: '11px', fontFamily: 'monospace',
  };

  return (
    <div
      className="h-full flex flex-col shrink-0 z-[1000] custom-scrollbar overflow-y-auto"
      style={{ width: '300px', background: '#ffffff', borderRight: '1px solid #e2e8f0' }}
    >
      <div className="p-5 flex flex-col gap-5">

        {/* Connection */}
        <div>
          <SectionTitle icon={Radio}>Kết Nối Hệ Thống</SectionTitle>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-3"
            style={{ background: statusConfig.bg, border: `1px solid ${statusConfig.border}` }}>
            <div className="w-2 h-2 rounded-full pulse-dot shrink-0" style={{ background: statusConfig.dot }} />
            <span className="text-xs font-bold" style={{ color: statusConfig.color }}>{statusConfig.text}</span>
          </div>
          <input type="text" value={wsUrl} onChange={(e) => setWsUrl(e.target.value)}
            style={{ ...inputStyle, marginBottom: '8px', fontFamily: 'monospace' }}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
          <button type="button" onClick={connectROS}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 btn-grad active:scale-95"
            style={{ boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
            <Wifi className="w-4 h-4" /> Ghi nhận IP & Kết nối
          </button>
        </div>

        {/* Origin */}
        <div className="rounded-xl p-4" style={{ background: '#f8fafc', border: '1px solid rgba(99,102,241,0.15)' }}>
          <SectionTitle icon={MapPin}>Gốc Tọa Độ</SectionTitle>
          <div className="text-[11px] space-y-2">
            {[['Vĩ độ (Lat)', REF_LAT], ['Kinh độ (Lon)', REF_LON]].map(([label, val]) => (
              <div key={String(label)} className="flex justify-between items-center">
                <span style={{ color: '#94a3b8' }}>{label}</span>
                <span className="font-bold font-mono grad-text">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Waypoints */}
        <div className="rounded-xl p-4" style={{ background: '#f0fdf4', border: '1px dashed rgba(6,182,212,0.3)' }}>
          <SectionTitle icon={Route}>Nhập Tọa Độ Quỹ Đạo</SectionTitle>
          <div className="space-y-2 mb-3">
            {[
              { label: 'WP1', state: wp1, setState: setWp1, phX: 'X1', phY: 'Y1' },
              { label: 'WP2', state: wp2, setState: setWp2, phX: 'X2', phY: 'Y2' },
              { label: 'WP3', state: wp3, setState: setWp3, phX: 'X3', phY: 'Y3' },
            ].map(({ label, state, setState, phX, phY }) => (
              <div key={label} className="flex gap-2 items-center">
                <span className="text-[10px] font-black w-8 shrink-0" style={{ color: '#6366f1' }}>{label}</span>
                <input type="number" value={state.x}
                  onChange={(e) => setState({ ...state, x: e.target.value })}
                  placeholder={phX} style={{ ...smallInputStyle, width: '100%' }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
                <input type="number" value={state.y}
                  onChange={(e) => setState({ ...state, y: e.target.value })}
                  placeholder={phY} style={{ ...smallInputStyle, width: '100%' }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleSendWaypoints}
              className="flex-1 py-2.5 rounded-lg font-bold text-xs text-white flex items-center justify-center gap-1.5 btn-grad active:scale-95">
              <Send className="w-3.5 h-3.5" /> Gửi Xuống Xe
            </button>
            <button type="button" onClick={clearWaypoints}
              className="px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center transition-all"
              style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e' }}
              title="Xóa quỹ đạo">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Telemetry */}
        <div>
          <SectionTitle icon={Activity}>Real-time Telemetry</SectionTitle>
          <div className="rounded-xl p-4 space-y-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            {[
              { label: 'Vĩ độ', value: telemetry.lat },
              { label: 'Kinh độ', value: telemetry.lon },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[11px] font-semibold" style={{ color: '#94a3b8' }}>{label}</span>
                <span className="font-mono font-bold text-sm grad-text">{value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-[11px] font-semibold" style={{ color: '#94a3b8' }}>Góc Yaw</span>
              <span className="font-mono font-bold text-sm px-3 py-1 rounded-lg"
                style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}>
                {telemetry.yaw}°
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
