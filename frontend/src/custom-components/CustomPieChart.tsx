import {useMemo, useState} from "react";
import {type QueryFunctionContext, type QueryKey, useQuery} from "@tanstack/react-query";
import {useBarLineChart} from "@/hooks/useBarLineChart";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {CustomDataTable} from "@custom/CustomDataTable.tsx";
import {CustomChartContainer} from "@custom/CustomChartContainer.tsx";
import {type ChartMode, CustomChartMenu, type FormatValuesMode} from "@custom/CustomChartMenu.tsx";
import {CustomChartFilters} from "@/custom-components-filter/CustomChartFilters.tsx";
import {type FilterAccessor, useChartFilters} from "@/hooks/useChartFilters";
import {usePieChart} from "@/hooks/usePieChart.ts";

type ValueFormat = "number" | "currency";

export type PieDatum = {
    areaAcademica: string;
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
};

type ModalChartProps = {
    title: string;
    footer: string;
    categories: readonly string[];
    values: readonly number[];
    colors?: string[];
    valueFormat?: ValueFormat;
    orientation?: "horizontal" | "vertical";
    mode: ChartMode;
    grid?: { left?: number; right?: number; top?: number; bottom?: number };
};

function ModalChart({
                        title,
                        footer,
                        categories,
                        values,
                        colors,
                        valueFormat,
                        orientation,
                        mode,
                        grid,
                    }: ModalChartProps) {
    const {containerRef} = useBarLineChart({
        title,
        footer,
        categories,
        values,
        colors,
        mode: mode === "data" || mode === 'graph' ? "pie" : mode,
        orientation,
        valueFormat,
        grid,
    });

    return (
        <>
            <div
                ref={containerRef}
                className={`w-full h-full${mode === "data" ? " hidden" : ""}`}
            />
            {mode === "data" && (
                <CustomDataTable
                    title={title}
                    categories={categories}
                    values={values}
                    valueFormat={valueFormat}
                    className="h-full"
                />
            )}
        </>
    );
}

export function CustomPieChart({queryKey, queryFn}: CustomChartPieProps) {
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

    const categories = filteredRows.map((d) => d.areaAcademica);
    const values = filteredRows.map((d) => d.total);

    const {containerRef, downloadImage} = usePieChart({
        title,
        info,
        categories,
        values,
        formatValue,
        selectedSex: selectedValues.sex,
        selectedYear: selectedValues.years,
    });

    return (
        <>
            <CustomChartContainer
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
                        categories={categories}
                        values={values}
                        className="h-full"
                    />
                )}

            </CustomChartContainer>

            <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
                <DialogContent className="w-[80vw] h-[90vh] max-w-none sm:max-w-none flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle className="text-lg">{title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 overflow-auto p-8">
                        <ModalChart
                            title={title}
                            footer={info}
                            categories={categories}
                            values={values}
                            mode={mode}
                            grid={{left: 0, right: 0, top: 0, bottom: 0}}
                        />
                    </div>
                    <p className="text-xs text-gray-400">{info}</p>
                </DialogContent>
            </Dialog>
        </>
    );
}
