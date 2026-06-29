import {useMemo, useState} from "react";
import {type QueryFunctionContext, type QueryKey, useQuery} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {CustomDataTable} from "@custom/CustomDataTable.tsx";
import {CustomChartContainer} from "@custom/CustomChartContainer.tsx";
import {CustomModalChart} from "@custom/CustomModalChart.tsx";
import {type ChartMode, CustomChartMenu, type FormatValuesMode} from "@custom/CustomChartMenu.tsx";
import {CustomChartFilters} from "@/custom-components-filter/CustomChartFilters.tsx";
import {type FilterAccessor, useChartFilters} from "@/hooks/useChartFilters";
import {type ChartOrientation, type ChartType, useChart} from "@/hooks/useChart.ts";
import {type ChartColorThemeId, chartColorThemes} from "@/config/chartConfig";

export type PieDatum = {
    name: string;
    year: number;
    sex: string;
    total: number;
    [key: string]: unknown;
};

export type PieColumn = {
    key: string;
    header: string;
};

export type ChartData = {
    title: string;
    description: string;
    info: string;
    filter: string[];
    columns?: PieColumn[];
    categoryLabel?: string;
    data: PieDatum[];
};

export type CustomChartPieProps = {
    queryKey: QueryKey;
    queryFn: (ctx: QueryFunctionContext) => Promise<ChartData>;
    selectedRegion?: string;
    selectedDependencia?: string;
    colorTheme?: ChartColorThemeId;
    /** Tipo de serie ECharts a renderizar. Default "pie". */
    chartType?: ChartType;
    /** Orientación de ejes para chartType "bar"/"line". Default "horizontal". */
    orientation?: ChartOrientation;
    /** Campo de PieDatum que separa la fila en múltiples series (p.ej. "tipo"), dejando `name` solo como categoría del eje. No aplica a chartType="pie". */
    seriesField?: string;
    /** Encabezado de columna a usar en modo tabla para cada valor de `seriesField`. Default: el propio valor. */
    seriesFieldLabel?: (seriesName: string) => string;
    /** Modos permitidos cuando hay una dependencia seleccionada (tiene prioridad sobre `allowedModesRegion`). */
    allowedModesDependencia?: ChartMode[];
    /** Modos permitidos cuando hay una región seleccionada y ninguna dependencia. */
    allowedModesRegion?: ChartMode[];
    /** Modos permitidos cuando no hay ni región ni dependencia seleccionada. */
    allowedModesDefault?: ChartMode[];
    /** Oculta la columna "Valor" en el modo tabla. */
    hideValueColumn?: boolean;
};

export function CustomChart({
                                   queryKey,
                                   queryFn,
                                   selectedRegion,
                                   selectedDependencia,
                                   colorTheme = "default",
                                   chartType = "pie",
                                   orientation = "horizontal",
                                   seriesField,
                                   seriesFieldLabel = (s) => s,
                                   allowedModesDependencia = ["graph", "data"],
                                   allowedModesRegion = ["graph", "data"],
                                   allowedModesDefault = ["graph", "data"],
                                   hideValueColumn = false,
                               }: CustomChartPieProps) {
    const {data, isFetching, isError, refetch} = useQuery({queryKey, queryFn});

    const isDependenciaSelected = !!selectedDependencia;
    const isRegionSelected = !!selectedRegion;

    const allowedModes = isDependenciaSelected
        ? allowedModesDependencia
        : isRegionSelected
            ? allowedModesRegion
            : allowedModesDefault;

    const [mode, setMode] = useState<ChartMode>("graph");
    const effectiveMode = allowedModes.includes(mode) ? mode : allowedModes[0] ?? "graph";
    const [formatValue, setFormatValue] = useState<FormatValuesMode>("numeric");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const title = data?.title ?? "";
    const info = data?.info ?? "Sin fuente de información definida";
    const hasData = !isFetching && !isError && !!data;

    const rows = data?.data ?? [];

    const allFilterAccessors = useMemo<Record<string, FilterAccessor<PieDatum>>>(() => ({
        sex: {
            get: (d) => d.sex,
            sort: (a, b) => (a === "Todos" ? -1 : b === "Todos" ? 1 : a.localeCompare(b)),
        },
        years: {
            get: (d) => String(d.year),
            sort: (a, b) => Number(b) - Number(a),
        },
        nivelEducativo: {
            get: (d) => String(d.nivelEducativo ?? ""),
            sort: (a, b) => (a === "Todos" ? -1 : b === "Todos" ? 1 : a.localeCompare(b)),
            allowAll: true,
        },
        modalidad: {
            get: (d) => String(d.modalidad ?? ""),
            sort: (a, b) => (a === "Todos" ? -1 : b === "Todos" ? 1 : a.localeCompare(b)),
            allowAll: true,
        },
    }), []);

    const filterAccessors = useMemo(
        () => Object.fromEntries(
            Object.entries(allFilterAccessors).filter(([key]) => (data?.filter ?? []).includes(key))
        ),
        [allFilterAccessors, data?.filter],
    );

    const {availableValues, selectedValues, setFilter, clearFilters, filteredRows, hasActiveFilters} = useChartFilters(rows, filterAccessors);

    const sortedRows = useMemo(
        () => [...filteredRows].sort((a, b) => b.total - a.total),
        [filteredRows],
    );

    // Cuando hay seriesField, varias filas comparten el mismo `name` (una por valor de seriesField,
    // p.ej. "Movilidad hacia adentro" / "hacia afuera"). Las categorías se deduplican preservando el
    // orden de aparición, en vez de ordenarse por total individual (que no aplica a una categoría con
    // múltiples series).
    const categories = useMemo(() => {
        if (!seriesField) return sortedRows.map((d) => d.name);
        const seen = new Set<string>();
        const names: string[] = [];
        for (const row of filteredRows) {
            if (!seen.has(row.name)) {
                seen.add(row.name);
                names.push(row.name);
            }
        }
        return names;
    }, [seriesField, filteredRows, sortedRows]);

    const values = useMemo(
        () => seriesField
            ? categories.map((name) =>
                filteredRows.filter((d) => d.name === name).reduce((sum, d) => sum + d.total, 0))
            : sortedRows.map((d) => d.total),
        [seriesField, categories, filteredRows, sortedRows],
    );

    const multiSeries = useMemo(() => {
        if (!seriesField) return undefined;
        const seen = new Set<string>();
        const seriesNames: string[] = [];
        for (const row of filteredRows) {
            const key = String(row[seriesField] ?? "");
            if (!seen.has(key)) {
                seen.add(key);
                seriesNames.push(key);
            }
        }
        return seriesNames.map((seriesName) => ({
            name: seriesName,
            values: categories.map((name) =>
                filteredRows.find((d) => d.name === name && String(d[seriesField] ?? "") === seriesName)?.total ?? 0),
        }));
    }, [seriesField, filteredRows, categories]);

    // Fila representativa por categoría, usada para alinear las `columns` declaradas por el backend
    // (descriptivas, no las series) cuando hay seriesField y por ende varias filas por categoría.
    const representativeRows = useMemo(
        () => seriesField ? categories.map((name) => filteredRows.find((d) => d.name === name)!) : sortedRows,
        [seriesField, categories, filteredRows, sortedRows],
    );

    const extraColumns = useMemo(
        () => [
            ...(multiSeries ?? []).map((s) => ({
                key: `series:${s.name}`,
                header: seriesFieldLabel(s.name),
                values: s.values.map((v) => v.toLocaleString()),
            })),
            ...(data?.columns ?? []).map((col) => ({
                key: col.key,
                header: col.header,
                values: representativeRows.map((d) => String(d[col.key] ?? "")),
            })),
        ],
        [multiSeries, seriesFieldLabel, data?.columns, representativeRows],
    );

    const total = useMemo(() => values.reduce((sum, v) => sum + v, 0), [values]);
    const subtext = useMemo(
        () => [
            `Total: ${total.toLocaleString()}`,
            selectedValues.sex && `Sexo: ${selectedValues.sex}`,
            selectedValues.years && `Año: ${selectedValues.years}`,
            selectedValues.nivelEducativo && `Nivel Educativo: ${selectedValues.nivelEducativo}`,
            selectedValues.modalidad && `Modalidad: ${selectedValues.modalidad}`,
        ]
            .filter(Boolean)
            .join(" · "),
        [total, selectedValues.sex, selectedValues.years, selectedValues.nivelEducativo, selectedValues.modalidad],
    );

    const {containerRef, downloadImage} = useChart({
        title,
        info,
        categories,
        values,
        colors: [...chartColorThemes[colorTheme]],
        formatValue,
        chartType,
        orientation,
        series: multiSeries,
        selectedSex: selectedValues.sex,
        selectedYear: selectedValues.years,
        selectedNivelEducativo: selectedValues.nivelEducativo,
        selectedModalidad: selectedValues.modalidad,
        selectedRegion,
        selectedDependencia,
    });

    return (
        <CustomModalChart isFullscreen={isFullscreen} onOpenChange={setIsFullscreen} title={title} selectedRegion={selectedRegion} selectedDependencia={selectedDependencia}>
            <CustomChartContainer
                isFullscreen={isFullscreen}
                onClose={() => setIsFullscreen(false)}
                footer={hasData ? info : ""}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
                selectedRegion={selectedRegion}
                selectedDependencia={selectedDependencia}
                filter={hasData ? (
                        <CustomChartFilters
                            available={data?.filter ?? []}
                            availableValues={availableValues}
                            selectedValues={selectedValues}
                            setFilter={setFilter}
                        />
                    )
                    :
                    undefined
                }
                action={
                    hasData ? (
                        <>
                            <CustomChartMenu
                                setIsFullscreen={() => setIsFullscreen(true)}
                                isFullscreen={isFullscreen}
                                title={title}
                                mode={effectiveMode}
                                allowedModes={allowedModes}
                                setFormatValue={setFormatValue}
                                onModeChange={setMode}
                                onReset={() => setMode("graph")}
                                onDownload={downloadImage} formatValue={formatValue}/>

                        </>

                    ) : undefined
                }
            >
                {isFetching && (
                    <Spinner className="size-8 text-muted-foreground"/>
                )}

                {isError && !isFetching && (
                    <div className=" flex flex-col items-center justify-center gap-3">
                        <p className="text-sm text-muted-foreground">
                            Hubo un problema al cargar la información
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="cursor-pointer"
                        >
                            Intentar nuevamente
                        </Button>
                    </div>
                )}

                <div
                    ref={containerRef}
                    className={`w-full p-4 h-full ${(!hasData || effectiveMode === "data") ? " hidden" : ""}`}
                />

                {hasData && effectiveMode === "data" && (
                    <CustomDataTable
                        title={title}
                        subtext={subtext}
                        categoryLabel={data?.categoryLabel}
                        categories={categories}
                        values={values}
                        extraColumns={extraColumns}
                        formatValue={formatValue}
                        selectedRegion={selectedRegion}
                        selectedDependencia={selectedDependencia}
                        hideValueColumn={hideValueColumn}
                    />
                )}
            </CustomChartContainer>
        </CustomModalChart>
    );
}
