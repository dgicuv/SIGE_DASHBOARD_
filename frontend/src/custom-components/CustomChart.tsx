import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { useQuery, type QueryFunctionContext, type QueryKey } from "@tanstack/react-query";
import { useBarLineChart } from "@/hooks/useBarLineChart";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CustomModalChart } from "@custom/CustomModalChart.tsx";
import { CardGraph, ChartMenu } from "@custom/CardGraph";
import type { ChartMode } from "@custom/CardGraph";
import { CustomDataTable } from "@custom/CustomDataTable.tsx";

type ValueFormat = "number" | "currency";

export type ChartData = {
  title: string;
  description: string;
  categories: string[];
  values: number[];
  type: string;
  dataType: ValueFormat;
  xAxis: { name: string; type: string };
  yAxis: { name: string; type: string };
};

export type CustomChartProps = {
  queryKey: QueryKey;
  queryFn: (ctx: QueryFunctionContext) => Promise<ChartData>;
  orientation?: "horizontal" | "vertical";
  colors?: string[];
};

export function CustomChart({ queryKey, queryFn, orientation, colors }: CustomChartProps) {
  const [mode, setMode] = useState<ChartMode>("bar");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data, isFetching, isError, refetch } = useQuery({ queryKey, queryFn });

  const title = data?.title ?? "";
  const footer = data?.description ?? "";
  const hasData = !isFetching && !isError && !!data;

  const { containerRef, downloadImage } = useBarLineChart({
    title,
    footer,
    categories: data?.categories ?? [],
    values: data?.values ?? [],
    colors,
    mode: mode === "data" ? "bar" : mode,
    orientation,
    valueFormat: data?.dataType,
  });

  return (
    <CustomModalChart isFullscreen={isFullscreen} onOpenChange={setIsFullscreen} title={title}>
      <CardGraph
        title={hasData ? title : ""}
        footer={hasData ? footer : ""}
        action={
          hasData ? (
            <>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setIsFullscreen(true)}
                className="mr-2 cursor-pointer"
              >
                <Maximize2 />
              </Button>
              <ChartMenu
                title={title}
                mode={mode}
                onModeChange={setMode}
                onReset={() => setMode("bar")}
                onDownload={downloadImage}
                onRefetch={() => refetch()}
              />
            </>
          ) : undefined
        }
      >
        {isFetching && (
          <div className="w-full h-80 flex items-center justify-center">
            <Spinner className="size-8 text-muted-foreground" />
          </div>
        )}

        {isError && !isFetching && (
          <div className="w-full h-80 flex flex-col items-center justify-center gap-3">
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

        {/* Siempre en el DOM para que useEChart inicialice en el primer render */}
        <div
          ref={containerRef}
          className={`w-full h-80${(!hasData || mode === "data") ? " hidden" : ""}`}
        />

        {hasData && mode === "data" && (
          <CustomDataTable
            title={title}
            categories={data.categories}
            values={data.values}
            valueFormat={data.dataType}
          />
        )}
      </CardGraph>
    </CustomModalChart>
  );
}
