import { useMemo } from "react";
import type { EChartsOption } from "echarts";
import { useEChart } from "@/hooks/useEChart";
import { chartConfig } from "@/config/chartConfig";

type ValueFormat = "number" | "currency";

type UseBarLineChartParams = {
  title: string;
  footer: string;
  categories: readonly string[];
  values: readonly number[];
  colors?: string[];
  mode: "bar" | "line";
  valueFormat?: ValueFormat;
  grid?: { left?: number; right?: number; top?: number; bottom?: number };
};

export function useBarLineChart({
  title,
  footer,
  categories,
  values,
  colors = [...chartConfig.colors],
  mode,
  valueFormat = "number",
  grid = { left: 40, right: 40, top: 44, bottom: 44 },
}: UseBarLineChartParams) {
  const option = useMemo<EChartsOption>(
    () => {
      const fmt = valueFormat === "currency"
        ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
        : new Intl.NumberFormat("es-MX");
      return {
        tooltip: {
          trigger: "axis",
          formatter: (params: unknown) => {
            const p = (params as { name: string; value: number }[])[0];
            return `${p.name}: ${fmt.format(p.value)}`;
          },
        },
        color: colors,
        grid,
        yAxis: { type: "category", data: [...categories], axisLabel: { interval: 0 } },
        xAxis: { type: "value" },
        series: [
          {
            data: [...values],
            type: mode,
            label: {
              show: true,
              position: "right",
              formatter: (params: { value: number }) => fmt.format(params.value),
            },
          },
        ],
      } as EChartsOption;
    },
    [colors, categories, values, mode, grid, valueFormat],
  );

  const exportExtra: EChartsOption = {
    title: { text: title, left: 0, top: 0, textStyle: { fontSize: 20 } },
    graphic: {
      type: "text",
      left: 0,
      bottom: 0,
      style: { text: footer, fontSize: 13, fill: "#9ca3af" },
    },
  };

  const { containerRef, downloadImage } = useEChart(option);

  return {
    containerRef,
    downloadImage: () => downloadImage(title, exportExtra),
  };
}
