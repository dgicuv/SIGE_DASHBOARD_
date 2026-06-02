import { useMemo } from "react";
import { useTheme } from "next-themes";
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
  orientation?: "horizontal" | "vertical";
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
  orientation = "horizontal",
  valueFormat = "number",
  grid = { left: 40, right: 40, top: 44, bottom: 44 },
}: UseBarLineChartParams) {
  const { resolvedTheme } = useTheme();
  const labelColor = resolvedTheme === "dark" ? "#e4e4e7" : "#52525b";

  const option = useMemo<EChartsOption>(
    () => {
      const fmt = valueFormat === "currency"
        ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
        : new Intl.NumberFormat("es-MX");

      const isVertical = orientation === "vertical";
      const axisLabelStyle = { color: labelColor };

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
        xAxis: isVertical
          ? { type: "category", data: [...categories], axisLabel: { interval: 0, overflow: "break", width: 80, ...axisLabelStyle } }
          : { type: "value", axisLabel: axisLabelStyle },
        yAxis: isVertical
          ? { type: "value", axisLabel: axisLabelStyle }
          : { type: "category", data: [...categories], axisLabel: { interval: 0, ...axisLabelStyle } },
        series: [
          {
            data: [...values],
            type: mode,
            label: {
              show: true,
              position: isVertical ? "top" : "right",
              color: labelColor,
              formatter: (params: { value: number }) => fmt.format(params.value),
            },
          },
        ],
      } as EChartsOption;
    },
    [colors, categories, values, mode, orientation, grid, valueFormat, labelColor],
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
