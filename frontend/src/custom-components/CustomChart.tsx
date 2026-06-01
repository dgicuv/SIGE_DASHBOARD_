import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import { useBarLineChart } from "@/hooks/useBarLineChart";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardGraph, ChartMenu } from "@custom/CardGraph";
import type { ChartMode } from "@custom/CardGraph";
import { DataTable } from "@custom/DataTable";

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
  queryFn: () => Promise<ChartData>;
  orientation?: "horizontal" | "vertical";
  colors?: string[];
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
  const { containerRef } = useBarLineChart({
    title,
    footer,
    categories,
    values,
    colors,
    mode: mode === "data" ? "bar" : mode,
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
        <DataTable
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
    <>
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

        {isError && (
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
          <DataTable
            title={title}
            categories={data.categories}
            values={data.values}
            valueFormat={data.dataType}
          />
        )}
      </CardGraph>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="w-[80vw] h-[90vh] max-w-none sm:max-w-none flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-auto">
            <ModalChart
              title={title}
              footer={footer}
              categories={data?.categories ?? []}
              values={data?.values ?? []}
              colors={colors}
              valueFormat={data?.dataType}
              orientation={orientation}
              mode={mode}
              grid={{ left: 80, right: 80, top: 64, bottom: 64 }}
            />
          </div>
          <p className="text-xs text-gray-400">{footer}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
