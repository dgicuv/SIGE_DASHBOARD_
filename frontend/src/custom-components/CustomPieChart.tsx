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
import {usePieChart} from "@/hooks/usePieChart.ts";
import {type ChartColorThemeId, chartColorThemes} from "@/config/chartConfig";

export type PieDatum = {
    name: string;
    year: number;
    sex: string;
    total: number;
};

export type ChartData = {
    title: string;
    description: string;
    info: string;
    filter: string[];
    data: PieDatum[];
};

export type CustomChartPieProps = {
    queryKey: QueryKey;
    queryFn: (ctx: QueryFunctionContext) => Promise<ChartData>;
    selectedRegion?: string;
    selectedDependencia?: string;
    colorTheme?: ChartColorThemeId;
    /** Modos permitidos cuando hay una dependencia seleccionada (tiene prioridad sobre `allowedModesRegion`). */
    allowedModesDependencia?: ChartMode[];
    /** Modos permitidos cuando hay una región seleccionada y ninguna dependencia. */
    allowedModesRegion?: ChartMode[];
    /** Modos permitidos cuando no hay ni región ni dependencia seleccionada. */
    allowedModesDefault?: ChartMode[];
    /** Indica si actualmente hay una dependencia seleccionada. */
    isDependenciaSelected?: boolean;
    /** Indica si actualmente hay una región seleccionada. */
    isRegionSelected?: boolean;
};

export function CustomPieChart({
                                   queryKey,
                                   queryFn,
                                   selectedRegion,
                                   selectedDependencia,
                                   colorTheme = "default",
                                   allowedModesDependencia = ["graph", "data"],
                                   allowedModesRegion = ["graph", "data"],
                                   allowedModesDefault = ["graph", "data"],
                                   isDependenciaSelected = false,
                                   isRegionSelected = false,
                               }: CustomChartPieProps) {
    const {data, isFetching, isError, refetch} = useQuery({queryKey, queryFn});

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

    const filterAccessors = useMemo<Record<string, FilterAccessor<PieDatum>>>(() => ({
        sex: {
            get: (d) => d.sex,
            sort: (a, b) => (a === "Todos" ? -1 : b === "Todos" ? 1 : a.localeCompare(b)),
        },
        years: {
            get: (d) => String(d.year),
            sort: (a, b) => Number(b) - Number(a),
        },
    }), []);

    const {availableValues, selectedValues, setFilter, filteredRows} = useChartFilters(rows, filterAccessors);

    const sortedRows = useMemo(
        () => [...filteredRows].sort((a, b) => b.total - a.total),
        [filteredRows],
    );

    const categories = sortedRows.map((d) => d.name);
    const values = sortedRows.map((d) => d.total);

    const total = useMemo(() => values.reduce((sum, v) => sum + v, 0), [values]);
    const subtext = useMemo(
        () => [
            `Total: ${total.toLocaleString()}`,
            selectedValues.sex && `Sexo: ${selectedValues.sex}`,
            selectedValues.years && `Año: ${selectedValues.years}`
        ]
            .filter(Boolean)
            .join(" · "),
        [total, selectedValues.sex, selectedValues.years],
    );

    const {containerRef, downloadImage} = usePieChart({
        title,
        info,
        categories,
        values,
        colors: [...chartColorThemes[colorTheme]],
        formatValue,
        selectedSex: selectedValues.sex,
        selectedYear: selectedValues.years,
        selectedRegion,
        selectedDependencia,
    });

    return (
        <CustomModalChart isFullscreen={isFullscreen} onOpenChange={setIsFullscreen} title={title}>
            <CustomChartContainer
                isFullscreen={isFullscreen}
                onClose={() => setIsFullscreen(false)}
                footer={hasData ? info : ""}
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
                        categories={categories}
                        values={values}
                        formatValue={formatValue}
                    />
                )}
            </CustomChartContainer>
        </CustomModalChart>
    );
}
