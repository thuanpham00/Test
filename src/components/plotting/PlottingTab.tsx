import { BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LiveLineChart } from './LiveLineChart';

export function PlottingTab({ active }: { active: boolean }) {
  const { chartData, msgCount } = useApp();

  return (
    <div className="h-full flex-col overflow-y-auto p-8 md:p-12 bg-app-bg custom-scrollbar w-full flex">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8 border-b-2 border-border pb-4 flex-wrap">
          <h1 className="text-3xl font-black text-text-main tracking-wider uppercase">Data Plotting</h1>
          <span className="bg-white border border-border text-text-muted shadow-sm text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" /> Live Stream
          </span>
          <span className="text-xs text-text-muted font-semibold ml-auto bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
            Đã nhận: <span className="text-primary font-black font-mono text-sm ml-1">{msgCount}</span> messages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
