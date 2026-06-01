import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

export function useEChart(option: EChartsOption) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption({ ...option, animation: false }, { notMerge: false });
  }, [option]);

  function downloadImage(filename: string, exportExtra?: Partial<EChartsOption>) {
    if (!chartRef.current) return;

    if (exportExtra) {
      chartRef.current.setOption(exportExtra, { notMerge: false });
    }

    const url = chartRef.current.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#fff",
    });

    if (exportExtra) {
      chartRef.current.setOption(option, { notMerge: true });
    }

    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.png`;
    a.click();
  }

  return { containerRef, downloadImage };
}
