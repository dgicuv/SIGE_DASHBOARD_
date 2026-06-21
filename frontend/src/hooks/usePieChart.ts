import {useMemo} from "react";
import {useTheme} from "next-themes";
import type {EChartsOption} from "echarts";
import {useEChart} from "@/hooks/useEChart";
import {useIsMobile} from "@/hooks/use-mobile";
import {chartConfig} from "@/config/chartConfig";
import type {FormatValuesMode} from "@custom/CustomChartMenu.tsx";

type UsePieChartParams = {
    title: string;
    info: string;
    categories: readonly string[];
    values: readonly number[];
    colors?: string[];
    formatValue: FormatValuesMode;
    label?: string | [string, string];
    subtitle?: string;
    selectedSex?: string;
    selectedYear?: string;
};

export function usePieChart({
                                title,
                                info,
                                categories,
                                values,
                                colors = [...chartConfig.colors],
                                formatValue,
                                label = "Total",
                                subtitle,
                                selectedSex,
                                selectedYear,
                            }: UsePieChartParams) {
    const {resolvedTheme} = useTheme();
    const isMobile = useIsMobile();
    const labelColor = resolvedTheme === "dark" ? "#e4e4e7" : "#52525b";
    const [labelLine1, labelLine2] = Array.isArray(label) ? label : [label, undefined];
    const selectedGenero = selectedSex;
    const selectedAnio = selectedYear;

    const filteredData = useMemo(
        () => categories.map((name, i) => ({name, value: values[i]})),
        [categories, values],
    );

    const total = useMemo(() => values.reduce((sum, value) => sum + value, 0), [values]);
    const pieData = useMemo(
        () => (filteredData),
        [filteredData],
    );

    const option = useMemo<EChartsOption>(
        () => ({
            tooltip: {
                trigger: "item",
                show: true,
                formatter: (params: unknown) => {
                    const p = params as { name: string; value: number; percent: number };
                    return formatValue === "percent"
                        ? `${p.name}: ${p.percent}% (${p.value.toLocaleString()})`
                        : `${p.name}: ${p.value.toLocaleString()} (${p.percent}%)`;
                },
            },
            color: colors,
            title: title
                ? {
                    text: title,
                    subtext: [`Total: ${total.toLocaleString()}`, subtitle, `Sexo: ${selectedGenero}`, `Año: ${selectedAnio}`]
                        .filter(Boolean)
                        .join(" · "),
                    left: "center",
                    top: 0,
                    textStyle: {color: labelColor, fontSize: 14},
                    subtextStyle: {color: labelColor, fontSize: 12},
                }
                : undefined,
            legend: {
                bottom: 0,
                type: "plain",
                data: filteredData.map((d) => d.name),
                textStyle: {color: labelColor},
                itemGap: 16,
                selectedMode: false,
                icon: 'pin',
                Animation: false
            },
            series: [
                {
                    type: "pie",
                    radius: isMobile ? ["0%", "38%"] : ["0%", "50%"],
                    center: ["50%", "50%"],
                    avoidLabelOverlap: true,
                    stillShowZeroSum: true,
                    label: {
                        show: true,
                        position: "outside",
                        color: labelColor,
                        fontSize: 13,
                        formatter: formatValue === "percent" ? "{d}%" : "{c}",
                    },
                    labelLine: {show: true},
                    data: pieData,
                },
            ],
            graphic: {
                type: "text",
                left: "center",
                top: "50%",
                style: {
                    text: `{big|${total.toLocaleString()}}\n{small|${labelLine1}}${labelLine2 ? `\n{small|${labelLine2}}` : ""}`,
                    rich: {
                        big: {fontSize: 28, fontWeight: "bold", fill: labelColor, lineHeight: 32},
                        small: {fontSize: 13, fill: labelColor, lineHeight: 16},
                    },
                    textAlign: "center",
                },
            },
        }),
        [
            colors,
            filteredData,
            pieData,
            total,
            labelColor,
            labelLine1,
            labelLine2,
            title,
            subtitle,
            selectedGenero,
            selectedAnio,
            formatValue,
            isMobile,
        ],
    );

    const exportLabelColor = "#374151";
    const exportExtra: EChartsOption = {
        title: {text: title, left: 0, top: 0, textStyle: {fontSize: 20}},
        graphic: {
            type: "text",
            left: 0,
            bottom: 0,
            style: {text: info, fontSize: 13, fill: "#6b7280"},
        },
        series: [{label: {color: exportLabelColor}}],
    };

    const {containerRef, downloadImage} = useEChart(option);

    return {
        containerRef,
        downloadImage: () => downloadImage(title, exportExtra),
    };
}