import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import type { EChartsOption } from "echarts";
import { useEChart } from "@/hooks/useEChart";
import { useIsMobile } from "@/hooks/use-mobile";
import { chartConfig as colorConfig } from "@/config/chartConfig";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Item } from "@/components/ui/item";
import { CustomChartMenu } from "./CustomChartMenu.tsx";
import {CustomChartContainer} from "@custom/CustomChartContainer.tsx";
import {CustomPieChart} from "@custom/CustomPieChart.tsx";

export type TemporalDatum = {
    name: string;
    value: number;
    sexo: string;
    anio: number;
};

type TemporalProps = {
    data: TemporalDatum[];
    colors?: string[];
    label?: string | [string, string];
    title?: string;
    subtitle?: string;
};

export function Temporal({ data, colors = [...colorConfig.colors], label = "Total", title, subtitle }: TemporalProps) {
    const { resolvedTheme } = useTheme();
    const isMobile = useIsMobile();
    const labelColor = resolvedTheme === "dark" ? "#e4e4e7" : "#52525b";
    const [labelLine1, labelLine2] = Array.isArray(label) ? label : [label, undefined];

    const [genero, setGenero] = useState<string | null>(null);
    const [anio, setAnio] = useState<string | null>(null);
    const [modo, setModo] = useState<string | null>(null);

    const modosDisponibles = ["Número", "Porcentaje"];

    const aniosDisponibles = useMemo(
        () => Array.from(new Set(data.map((d) => d.anio))).sort((a, b) => b - a),
        [data],
    );

    const generosDisponibles = useMemo(
        () => Array.from(new Set(data.map((d) => d.sexo))).sort((a, b) => (a === "Todos" ? -1 : b === "Todos" ? 1 : 0)),
        [data],
    );

    const selectedAnio = anio ?? (aniosDisponibles.length > 0 ? String(aniosDisponibles[0]) : "");
    const selectedGenero =
        genero ?? (generosDisponibles.includes("Todos") ? "Todos" : generosDisponibles[0] ?? "");
    const selectedModo = modo ?? modosDisponibles[0];
    const esPorcentaje = selectedModo === "Porcentaje";

    const filteredData = useMemo(() => {
        const filtered = data.filter((d) => d.sexo === selectedGenero && d.anio === Number(selectedAnio));
        const totals = new Map<string, number>();
        filtered.forEach((d) => totals.set(d.name, (totals.get(d.name) ?? 0) + d.value));
        return Array.from(totals, ([name, value]) => ({ name, value }));
    }, [data, selectedGenero, selectedAnio]);

    const total = useMemo(() => filteredData.reduce((sum, d) => sum + d.value, 0), [filteredData]);
    const isEmpty = total === 0;
    const pieData = useMemo(
        () => (isEmpty ? [{ name: "Sin datos", value: 1 }] : filteredData),
        [isEmpty, filteredData],
    );

    const option = useMemo<EChartsOption>(
        () => ({
            tooltip: { trigger: "item", show: !isEmpty, formatter: esPorcentaje ? "{b}: {d}%" : "{b}: {c}" },
            color: isEmpty ? ["#a1a1aa"] : colors,
            title: title
                ? {
                    text: title,
                    subtext: [`Total: ${total.toLocaleString()}`, subtitle, `Sexo: ${selectedGenero}`, `Año: ${selectedAnio}`]
                        .filter(Boolean)
                        .join(" · "),
                    left: "center",
                    top: 8,
                    textStyle: { color: labelColor, fontSize: 14 },
                    subtextStyle: { color: labelColor, fontSize: 12 },
                }
                : undefined,
            legend: {
                bottom: 0,
                type: "plain",
                data: isEmpty ? [] : filteredData.map((d) => d.name),
                textStyle: { color: labelColor },
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
                    stillShowZeroSum: false,
                    label: {
                        show: !isEmpty,
                        position: "outside",
                        color: labelColor,
                        fontSize: 13,
                        formatter: esPorcentaje ? "{d}%" : "{c}",
                    },
                    labelLine: { show: !isEmpty },
                    data: pieData,
                },
            ],
            graphic: {
                type: "text",
                left: "center",
                top: "52%",
                style: {
                    text: `{big|${total.toLocaleString()}}\n{small|${labelLine1}}${labelLine2 ? `\n{small|${labelLine2}}` : ""}`,
                    rich: {
                        big: { fontSize: 28, fontWeight: "bold", fill: labelColor, lineHeight: 32 },
                        small: { fontSize: 13, fill: labelColor, lineHeight: 16 },
                    },
                    textAlign: "center",
                },
            },
        }),
        [
            colors,
            filteredData,
            pieData,
            isEmpty,
            total,
            labelColor,
            labelLine1,
            labelLine2,
            title,
            subtitle,
            selectedGenero,
            selectedAnio,
            esPorcentaje,
            isMobile,
        ],
    );

    const { containerRef } = useEChart(option);

    return (
        <CustomPieChart>
            <div className="w-full">
                <div className="flex gap-2 start">
                    <Combobox value={selectedGenero} onValueChange={(val) => setGenero(val)}>
                        <ComboboxInput placeholder="Sexo" className="w-40" readOnly />
                        <ComboboxContent>
                            <ComboboxList>
                                {generosDisponibles.map((g) => (
                                    <ComboboxItem key={g} value={g}>
                                        {g}
                                    </ComboboxItem>
                                ))}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>

                    <Combobox value={selectedAnio} onValueChange={(val) => setAnio(val)}>
                        <ComboboxInput placeholder="Año" className="w-40" readOnly />
                        <ComboboxContent>
                            <ComboboxList>
                                {aniosDisponibles.map((a) => (
                                    <ComboboxItem key={a} value={String(a)}>
                                        {a}
                                    </ComboboxItem>
                                ))}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>


                    <Combobox value={selectedModo} onValueChange={(val) => setModo(val)}>
                        <ComboboxInput placeholder="Mostrar" className="w-40" readOnly />
                        <ComboboxContent>
                            <ComboboxList>
                                {modosDisponibles.map((m) => (
                                    <ComboboxItem key={m} value={m}>
                                        {m}
                                    </ComboboxItem>
                                ))}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </div>
                <div ref={containerRef} className="w-full my-8 h-112 md:h-112 lg:h-96 mx-auto" />
            </div>

        </CustomPieChart>
    );
}
