import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { useBarLineChart } from "@/hooks/useBarLineChart";
import { Button } from "@/components/ui/button";
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

type CustomChartProps = {
  title: string;
  footer: string;
  categories: readonly string[];
  values: readonly number[];
  colors?: string[];
  valueFormat?: ValueFormat;
};

type ModalChartProps = CustomChartProps & {
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

export function CustomChart({
  title,
  footer,
  categories,
  values,
  colors,
  valueFormat,
}: CustomChartProps) {
  const [mode, setMode] = useState<ChartMode>("bar");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { containerRef, downloadImage } = useBarLineChart({
    title,
    footer,
    categories,
    values,
    colors,
    mode: mode === "data" ? "bar" : mode,
    valueFormat,
  });

  return (
    <>
      <CardGraph
        title={title}
        footer={footer}
        action={
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
            />
          </>
        }
      >
        <div
          ref={containerRef}
          className={`w-full h-80${mode === "data" ? " hidden" : ""}`}
        />
        {mode === "data" && (
          <DataTable
            title={title}
            categories={categories}
            values={values}
            valueFormat={valueFormat}
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
              categories={categories}
              values={values}
              colors={colors}
              valueFormat={valueFormat}
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
