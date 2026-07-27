import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useRef } from 'react';
import { MAX_DATA_POINTS } from '../../theme/colors';
import { colors } from '../../theme/colors';

export interface ChartSeriesConfig {
  name: string;
  data: number[];
  dashed?: boolean;
  color?: string;
}

interface LiveLineChartProps {
  title: string;
  series: ChartSeriesConfig[];
  yAxisLabel: string;
  filled?: boolean;
  active?: boolean;
  fullWidth?: boolean;
}

export function LiveLineChart({
  title,
  series,
  yAxisLabel,
  filled = false,
  active = true,
  fullWidth = false,
}: LiveLineChartProps) {
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        chartRef.current?.getEchartsInstance()?.resize();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [active]);

  const option = useMemo(
    () => ({
      animation: false,
      backgroundColor: 'transparent',
      grid: { left: 52, right: 16, top: 44, bottom: 24 },
      legend: {
        top: 0,
        textStyle: { color: colors.textMuted, fontWeight: 700, fontFamily: 'Montserrat', fontSize: 11 },
        itemStyle: { borderWidth: 0 },
      },
      xAxis: {
        type: 'category',
        show: false,
        data: Array.from({ length: MAX_DATA_POINTS }, (_, i) => i),
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        nameTextStyle: { color: '#94a3b8', fontWeight: 'bold', fontFamily: 'Montserrat', fontSize: 10 },
        axisLabel: { color: '#94a3b8', fontFamily: 'Montserrat', fontSize: 10 },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLine: { lineStyle: { color: '#e2e8f0' } },
      },
      series: series.map((s, index) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: s.data,
        lineStyle: {
          width: s.dashed ? 2 : 2.5,
          type: s.dashed ? 'dashed' : 'solid',
          color: s.color ?? (index === 0 ? colors.primary : colors.chartSecondary),
        },
        itemStyle: {
          color: s.color ?? (index === 0 ? colors.primary : colors.chartSecondary),
        },
        areaStyle: filled && !s.dashed
          ? {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(99,102,241,0.25)' },
                  { offset: 1, color: 'rgba(99,102,241,0.01)' },
                ],
              },
            }
          : undefined,
      })),
    }),
    [series, yAxisLabel, filled],
  );

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col relative overflow-hidden card-glow ${fullWidth ? 'md:col-span-2' : ''}`}
      style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(99,102,241,0.06)' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(6,182,212,0.3), transparent)' }}
      />

      <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#64748b' }}>
        <span className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'inline-block' }} />
        {title}
      </h3>
      <div className="flex-1 relative min-h-[220px] w-full">
        <ReactECharts
          ref={chartRef}
          option={option}
          style={{ height: fullWidth ? 260 : 230, width: '100%' }}
          notMerge
        />
      </div>
    </div>
  );
}
