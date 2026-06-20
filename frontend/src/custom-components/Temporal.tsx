import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import type { EChartsOption } from "echarts";
import { useEChart } from "@/hooks/useEChart";
import { chartConfig as colorConfig } from "@/config/chartConfig";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";

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
    const labelColor = resolvedTheme === "dark" ? "#e4e4e7" : "#52525b";
    const [labelLine1, labelLine2] = Array.isArray(label) ? label : [label, undefined];

    const [genero, setGenero] = useState<string | null>(null);
    const [anio, setAnio] = useState<string | null>(null);

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

    const filteredData = useMemo(() => {
        const filtered = data.filter((d) => d.sexo === selectedGenero && d.anio === Number(selectedAnio));
        const totals = new Map<string, number>();
        filtered.forEach((d) => totals.set(d.name, (totals.get(d.name) ?? 0) + d.value));
        return Array.from(totals, ([name, value]) => ({ name, value }));
    }, [data, selectedGenero, selectedAnio]);

    const total = useMemo(() => filteredData.reduce((sum, d) => sum + d.value, 0), [filteredData]);

    const option = useMemo<EChartsOption>(
        () => ({
            tooltip: { trigger: "item" },
            color: colors,
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
                data: filteredData.map((d) => d.name),
                textStyle: { color: labelColor },
                itemGap: 16,
                selectedMode: false,
                icon: 'pin',
                Animation: false
            },
            series: [
                {
                    type: "pie",
                    radius: ["0%", "50%"],
                    center: ["50%", "50%"],
                    avoidLabelOverlap: true,
                    stillShowZeroSum: false,
                    label: {
                        show: true,
                        position: "outside",
                        color: labelColor,
                        fontSize: 13,
                        formatter: "{c}",
                    },
                    labelLine: { show: true },
                    data: filteredData,
                },
            ],
            graphic: {
                type: "text",
                left: "center",
                top: title ? "52%" : "34%",
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
        [colors, filteredData, total, labelColor, labelLine1, labelLine2, title, subtitle, selectedGenero, selectedAnio],
    );

    const { containerRef } = useEChart(option);

    return (
        <div className="w-full">
            <div className="flex gap-2 justify-end">
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
            </div>
            <div ref={containerRef} className="w-full my-8 h-96" />
        </div>
    );
}
