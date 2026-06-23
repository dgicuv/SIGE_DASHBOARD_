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
    selectedNivelEducativo?: string;
    selectedModalidad?: string;
    selectedRegion?: string;
    selectedDependencia?: string;
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
                                selectedNivelEducativo,
                                selectedModalidad,
                                selectedRegion,
                                selectedDependencia,
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

    const centerTotalGraphic = useMemo(
        () => ({
            id: "centerTotal",
            type: "text" as const,
            left: "center",
            top: "50%",
            style: {
                text: `{big|${total.toLocaleString()}}\n{small|${labelLine1}}${labelLine2 ? `\n{small|${labelLine2}}` : ""}`,
                rich: {
                    big: {fontSize: 28, fontWeight: "bold", fill: labelColor, lineHeight: 32},
                    small: {fontSize: 13, fill: labelColor, lineHeight: 16},
                },
                textAlign: "center" as const,
            },
        }),
        [total, labelLine1, labelLine2, labelColor],
    );

    const subtext = useMemo(
        () => [
            `Total: ${total.toLocaleString()}`,
            subtitle,
            `Sexo: ${selectedGenero}`,
            `Año: ${selectedAnio}`,
            selectedNivelEducativo && `Nivel Educativo: ${selectedNivelEducativo}`,
            selectedModalidad && `Modalidad: ${selectedModalidad}`,
        ]
            .filter(Boolean)
            .join(" · "),
        [total, subtitle, selectedGenero, selectedAnio, selectedNivelEducativo, selectedModalidad],
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
                    subtext,
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
            graphic: [centerTotalGraphic],
        }),
        [
            colors,
            filteredData,
            pieData,
            labelColor,
            title,
            subtext,
            formatValue,
            isMobile,
            centerTotalGraphic,
        ],
    );

    const exportLabelColor = "#374151";
    const footerDetail = [
        selectedRegion && `Región: ${selectedRegion}`,
        selectedDependencia && `Dependencia: ${selectedDependencia}`,
    ]
        .filter(Boolean)
        .join(" · ");
    const exportSubtext = [
        subtext,
        info,
        selectedRegion && `Región: ${selectedRegion}`,
        selectedDependencia && `Dependencia: ${selectedDependencia}`,
    ]
        .filter(Boolean)
        .join("\n");
    const exportExtra: EChartsOption = {
        title: {
            text: title,
            subtext: exportSubtext,
            left: 0,
            top: 0,
            textStyle: {fontSize: 20, color: exportLabelColor},
            subtextStyle: {color: exportLabelColor, fontSize: 8, lineHeight: 13},
        },
        legend: {textStyle: {color: exportLabelColor}},
        // Incluye centerTotalGraphic de nuevo (con colores fijos para export): el merge de
        // ECharts por id en "graphic" no garantiza conservar elementos previos, así que se
        // reenvía la lista completa.
        graphic: [
            {
                ...centerTotalGraphic,
                style: {
                    ...centerTotalGraphic.style,
                    rich: {
                        big: {...centerTotalGraphic.style.rich.big, fill: exportLabelColor},
                        small: {...centerTotalGraphic.style.rich.small, fill: exportLabelColor},
                    },
                },
            },
            {
                id: "footerText",
                type: "text",
                left: 0,
                bottom: 0,
                style: {
                    text: footerDetail ? `${info}\n${footerDetail}` : info,
                    fontSize: 13,
                    fill: "#6b7280",
                },
            },
        ],
        series: [{label: {color: exportLabelColor}}],
    };

    const {containerRef, downloadImage} = useEChart(option, exportExtra);

    return {
        containerRef,
        downloadImage: () => downloadImage(title),
    };
}