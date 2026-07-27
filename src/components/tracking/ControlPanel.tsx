import { Activity, MapPin, Radio, Route, Send, Trash2, Wifi } from 'lucide-react';
import { useState } from 'react';
import { REF_LAT, REF_LON } from '../../theme/colors';
import { useApp } from '../../context/AppContext';

export function ControlPanel() {
  const {
    wsUrl,
    setWsUrl,
    connectionStatus,
    connectROS,
    telemetry,
    sendManualWaypoints,
    clearWaypoints,
    showNotification,
  } = useApp();

  const [wp1, setWp1] = useState({ x: '', y: '' });
  const [wp2, setWp2] = useState({ x: '', y: '' });
  const [wp3, setWp3] = useState({ x: '', y: '' });

  const statusClass =
    connectionStatus === 'connected'
      ? 'bg-primary text-white shadow-md'
      : connectionStatus === 'error'
        ? 'bg-red-50 border border-red-200 text-error'
        : connectionStatus === 'connecting'
          ? 'bg-slate-100 border border-slate-200 text-slate-500'
          : 'bg-slate-100 border border-slate-200 text-slate-500';

  const statusText =
    connectionStatus === 'connected'
      ? 'Đã Kết Nối ROS 2!'
      : connectionStatus === 'error'
        ? 'Lỗi WebSockets!'
        : connectionStatus === 'connecting'
          ? 'Đang kết nối...'
          : 'Chưa kết nối';

  const handleSendWaypoints = () => {
    const x1 = parseFloat(wp1.x);
    const y1 = parseFloat(wp1.y);
    const x2 = parseFloat(wp2.x);
    const y2 = parseFloat(wp2.y);
    const x3 = parseFloat(wp3.x);
    const y3 = parseFloat(wp3.y);

    if ([x1, y1, x2, y2, x3, y3].some(Number.isNaN)) {
      showNotification('Vui lòng nhập đầy đủ tọa độ X, Y hợp lệ cho cả 3 điểm!', 'warning');
      return;
    }

    sendManualWaypoints({ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 });
  };

  return (
    <div className="w-[340px] h-full bg-panel border-r border-border shadow-sm flex flex-col z-[1000] shrink-0">
      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 custom-scrollbar">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-black text-text-main uppercase tracking-wider">Kết Nối Hệ Thống</h2>
          </div>
          <div className={`py-2.5 px-4 rounded-xl text-xs font-bold text-center transition-all shadow-inner ${statusClass}`}>
            {statusText}
          </div>
        </div>

        <div>
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-border text-text-main rounded-xl text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-3 transition shadow-inner font-semibold"
          />
          <button
            type="button"
            onClick={connectROS}
            className="w-full py-3 bg-text-main hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Wifi className="w-4 h-4 text-primary-light" /> Ghi nhận IP & Kết nối
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-border border-l-4 border-l-primary shadow-sm">
          <h3 className="text-xs font-black text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Gốc Tọa Độ
          </h3>
          <div className="text-xs">
            <div className="text-text-muted mb-2 font-medium">Gốc (0,0) quy đổi Odom XY:</div>
            <div className="text-text-main mb-1 font-semibold flex justify-between">
              <span>Vĩ độ (Lat):</span>
              <span className="font-bold font-mono text-primary">{REF_LAT}</span>
            </div>
            <div className="text-text-main font-semibold flex justify-between">
              <span>Kinh độ (Lon):</span>
              <span className="font-bold font-mono text-primary">{REF_LON}</span>
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-primary/30 bg-blue-50/50 p-4 rounded-xl text-xs relative">
          <h3 className="text-[11px] font-black text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5" />
            Nhập Tọa Độ Quỹ Đạo (XY)
          </h3>

          <div className="space-y-2 mb-4">
            {[
              { label: 'WP 1', state: wp1, setState: setWp1, phX: 'X1', phY: 'Y1' },
              { label: 'WP 2', state: wp2, setState: setWp2, phX: 'X2', phY: 'Y2' },
              { label: 'WP 3', state: wp3, setState: setWp3, phX: 'X3', phY: 'Y3' },
            ].map(({ label, state, setState, phX, phY }) => (
              <div key={label} className="flex gap-2">
                <span className="font-bold text-text-main w-9 shrink-0 flex items-center">{label}</span>
                <input
                  type="number"
                  value={state.x}
                  onChange={(e) => setState({ ...state, x: e.target.value })}
                  placeholder={phX}
                  className="w-full p-2 rounded bg-white border border-border text-xs focus:border-primary outline-none font-mono"
                />
                <input
                  type="number"
                  value={state.y}
                  onChange={(e) => setState({ ...state, y: e.target.value })}
                  placeholder={phY}
                  className="w-full p-2 rounded bg-white border border-border text-xs focus:border-primary outline-none font-mono"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSendWaypoints}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all flex justify-center items-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" /> Gửi Xuống Xe
            </button>
            <button
              type="button"
              onClick={clearWaypoints}
              className="px-3 py-2.5 bg-white hover:bg-slate-50 text-primary text-xs font-bold rounded-lg border border-primary/30 transition-all flex justify-center items-center shadow-sm"
              title="Xóa quỹ đạo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-xs font-black text-text-main uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Real-time Telemetry
          </h3>
          <div className="bg-slate-900 p-4 rounded-xl text-xs flex flex-col gap-3 shadow-lg relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] w-16 h-16 bg-primary/20 blur-2xl rounded-full" />
            <div className="flex justify-between items-center border-b border-slate-700 pb-2 relative z-10">
              <span className="text-slate-400 font-semibold">Vĩ độ hiện tại:</span>
              <span className="font-mono font-bold text-primary-light text-sm tracking-wide">{telemetry.lat}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-700 pb-2 relative z-10">
              <span className="text-slate-400 font-semibold">Kinh độ hiện tại:</span>
              <span className="font-mono font-bold text-primary-light text-sm tracking-wide">{telemetry.lon}</span>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-slate-400 font-semibold">Góc Yaw:</span>
              <span className="font-mono font-bold text-white text-sm bg-slate-800 px-2 py-1 rounded shadow-inner">
                {telemetry.yaw}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
