import { BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LiveLineChart } from './LiveLineChart';

export function PlottingTab({ active }: { active: boolean }) {
  const { chartData, msgCount } = useApp();

  return (
    <div className="h-full overflow-y-auto p-6 custom-scrollbar w-full" style={{ background: '#f1f5f9' }}>
      <div className="max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 flex-wrap gap-3"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
          <div>
            <h1 className="text-2xl font-black tracking-widest uppercase grad-text">Data Plotting</h1>
            <p className="text-xs font-semibold mt-1" style={{ color: '#475569' }}>Live sensor data stream visualization</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
              <BarChart2 className="w-3.5 h-3.5" /> Live Stream
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99,102,241,0.15)', color: '#64748b' }}>
              Nhận:{' '}
              <span className="font-black font-mono" style={{ color: '#818cf8' }}>{msgCount}</span>{' '}
              messages
            </span>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <LiveLineChart
            active={active}
            title="Vận tốc Bánh Trái (Điều khiển & Thực tế)"
            yAxisLabel="Vận tốc (m/s)"
            series={[
              { name: 'Thực tế', data: chartData.left[0] },
              { name: 'Điều khiển', data: chartData.left[1], dashed: true },
            ]}
          />
          <LiveLineChart
            active={active}
            title="Vận tốc Bánh Phải (Điều khiển & Thực tế)"
            yAxisLabel="Vận tốc (m/s)"
            series={[
              { name: 'Thực tế', data: chartData.right[0] },
              { name: 'Điều khiển', data: chartData.right[1], dashed: true },
            ]}
          />
          <LiveLineChart
            active={active}
            title="Cross Track Error (Sai số ngang)"
            yAxisLabel="Sai số (m)"
            filled
            series={[{ name: 'Error (m)', data: chartData.cross[0] }]}
          />
          <LiveLineChart
            active={active}
            title="Along Track Distance (Khoảng cách còn lại)"
            yAxisLabel="Khoảng cách (m)"
            series={[{ name: 'Distance (m)', data: chartData.along[0] }]}
          />
          <LiveLineChart
            active={active}
            fullWidth
            title="Yaw vs Desired Heading"
            yAxisLabel="Góc (độ)"
            series={[
              { name: 'Thực tế', data: chartData.yaw[0] },
              { name: 'Mục tiêu', data: chartData.yaw[1], dashed: true },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
