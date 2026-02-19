'use client';

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from './Constant';
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';
import { fetcher } from '@/lib/coingecko.sctions';
import { convertOHLCData } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  data: OHLCData[];
  coinId: string;
  height?: number;
  initialPeriod?: string;
}

export const CandleStickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = 'daily',
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<string>(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
  const [isPending, startTransition] = useTransition();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const fetchOHLCdata = async (selectedPriod: Period) => {
    try {
      const config = PERIOD_CONFIG[selectedPriod];
      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        days: config.days,
        // interval: config.interval, only pro
        precision: 'full',
      });
      setOhlcData(newData ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;
    startTransition(async () => {
      setPeriod(newPeriod);
      await fetchOHLCdata(newPeriod);
    });
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;
    const showTime = ['daily', 'weekly', 'monthly'].includes(period);
    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    });
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());
    series.setData(convertOHLCData(ohlcData));
    chart.timeScale().fitContent();
    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      //distroy chart instance to prevent memeory leak
    };
  }, [height, ohlcData, period]);

  useEffect(() => {
    if (!candleSeriesRef.current) return;
    const convertedToSeconds = ohlcData.map(
      (item) =>
        [
          Math.floor(item[0] / 1000),
          item[1],
          item[2],
          item[3],
          item[4],
        ] as OHLCData
    );
    const converted = convertOHLCData(convertedToSeconds);
    candleSeriesRef.current.setData(converted);
    chartRef.current?.timeScale().fitContent()
  }, [ohlcData]);

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex flex-1">
          {children}
          <div className="button-group">
            <span className="text-sm mx-2 font-medum text-purple-100/50">
              Period:
            </span>
            {PERIOD_BUTTONS.map((item) => {
              return (
                <button
                  key={item.value}
                  className={
                    period === item.value
                      ? 'config-button-active'
                      : 'config-button'
                  }
                  onClick={() => {
                    handlePeriodChange(item.value);
                  }}
                  disabled={loading}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  );
};

export default CandleStickChart;
