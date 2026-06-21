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
    anio: number;
    sexo: string;
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
};

/**
 * Renames `nameField` from each raw backend row into `name`, the field PieDatum expects.
 * Use inside a queryFn to adapt an endpoint's grouping column (e.g. "region", "areaAcademica").
 */
export function mapPieDataField(
    raw: Omit<ChartData, "data"> & {data: Record<string, unknown>[]},
    nameField: string,
): ChartData {
    return {
        ...raw,
        data: raw.data.map(({[nameField]: name, ...rest}) => ({...rest, name})) as PieDatum[],
    };
}

export function CustomPieChart({
                                     queryKey,
                                     queryFn,
                                     selectedRegion,
                                     selectedDependencia,
                                     colorTheme = "default",
                                 }: CustomChartPieProps) {
    const {data, isFetching, isError, refetch} = useQuery({queryKey, queryFn});

    const [mode, setMode] = useState<ChartMode>("graph");
    const [formatValue, setFormatValue] = useState<FormatValuesMode>("numeric");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const title = data?.title ?? "";
    const info = data?.info ?? "Sin fuente de información definida";
    const hasData = !isFetching && !isError && !!data;

    const rows = data?.data ?? [];

    const filterAccessors = useMemo<Record<string, FilterAccessor<PieDatum>>>(() => ({
        sex: {
            get: (d) => d.sexo,
            sort: (a, b) => (a === "Todos" ? -1 : b === "Todos" ? 1 : a.localeCompare(b)),
        },
        years: {
            get: (d) => String(d.anio),
            sort: (a, b) => Number(b) - Number(a),
        },
    }), []);

    const {availableValues, selectedValues, setFilter, filteredRows} = useChartFilters(rows, filterAccessors);

    const categories = filteredRows.map((d) => d.name);
    const values = filteredRows.map((d) => d.total);

    const total = useMemo(() => values.reduce((sum, v) => sum + v, 0), [values]);
    const subtext = useMemo(
        () => [
            `Total: ${total.toLocaleString()}`,
            info,
            selectedValues.sex && `Sexo: ${selectedValues.sex}`,
            selectedValues.years && `Año: ${selectedValues.years}`,
            selectedRegion && `Región: ${selectedRegion}`,
            selectedDependencia && `Dependencia: ${selectedDependencia}`,
        ]
            .filter(Boolean)
            .join(" · "),
        [total, info, selectedValues.sex, selectedValues.years, selectedRegion, selectedDependencia],
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
                                mode={mode}
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
                    className={`w-full p-4 h-full ${(!hasData || mode === "data") ? " hidden" : ""}`}
                />

                {hasData && mode === "data" && (
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
