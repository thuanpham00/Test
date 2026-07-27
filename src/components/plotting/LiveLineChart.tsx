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
      grid: { left: 48, right: 16, top: 40, bottom: 24 },
      legend: {
        top: 0,
        textStyle: { color: colors.textMain, fontWeight: 800, fontFamily: 'Montserrat' },
      },
      xAxis: {
        type: 'category',
        show: false,
        data: Array.from({ length: MAX_DATA_POINTS }, (_, i) => i),
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        nameTextStyle: { color: '#94a3b8', fontWeight: 'bold', fontFamily: 'Montserrat' },
        axisLabel: { color: colors.textMuted, fontFamily: 'Montserrat' },
        splitLine: { lineStyle: { color: 'rgba(0,0,0,0.05)' } },
      },
      series: series.map((s, index) => ({
        name: s.name,
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: s.data,
        lineStyle: {
          width: s.dashed ? 2 : 3,
          type: s.dashed ? 'dashed' : 'solid',
          color: s.color ?? (index === 0 ? colors.primary : colors.chartSecondary),
        },
        itemStyle: {
          color: s.color ?? (index === 0 ? colors.primary : colors.chartSecondary),
        },
        areaStyle: filled && !s.dashed
          ? {
              color: 'rgba(37, 99, 235, 0.08)',
            }
          : undefined,
      })),
    }),
    [series, yAxisLabel, filled],
  );

  return (
    <div className={`bg-panel rounded-2xl p-6 shadow-sm border border-border flex flex-col ${fullWidth ? 'md:col-span-2' : ''}`}>
      <h3 className="text-xs font-black text-text-main uppercase tracking-wider mb-4 border-l-4 border-primary pl-2">
        {title}
      </h3>
      <div className="flex-1 relative min-h-[250px] w-full">
        <ReactECharts ref={chartRef} option={option} style={{ height: fullWidth ? 280 : 250, width: '100%' }} notMerge />
      </div>
    </div>
  );
}
