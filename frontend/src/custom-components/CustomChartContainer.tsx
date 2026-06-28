import { Item } from "@/components/ui/item";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { FilterIcon, FilterXIcon, InfoIcon } from "lucide-react";

type ChartItemProps = {
  footer: string;
  children: React.ReactNode;
  action: React.ReactNode;
  filter?: React.ReactNode;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  isFullscreen?: boolean;
  onClose?: () => void;
  title?: string;
  selectedRegion?: string;
  selectedDependencia?: string;
};

export function CustomChartContainer({
  action,
  filter,
  hasActiveFilters,
  onClearFilters,
  children,
  footer,
  isFullscreen,
  onClose,
  selectedRegion,
  selectedDependencia,
}: ChartItemProps) {
  return (
    <Item
      variant="default"
      className={`flex flex-col flex-nowrap bg-accent p-0 gap-0 ${isFullscreen ? "h-full" : "h-140"}`}
    >
      <div className="flex h-12 gap-2 p-2 items-center w-full">
        <div className={`flex gap-1 shrink-0 ${isFullscreen ? "w-24" : ""}`}>
          {filter && (
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    aria-invalid={hasActiveFilters}
                  >
                    <FilterIcon />
                  </Button>
                }
              />
              <PopoverContent align="start" className="w-auto">
                <div className="flex flex-col gap-2">{filter}</div>
              </PopoverContent>
            </Popover>
          )}
          {hasActiveFilters && onClearFilters && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    onClick={onClearFilters}
                  >
                    <FilterXIcon />
                  </Button>
                }
              />
              <TooltipContent>Limpiar filtros</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="flex grow min-w-0 items-center justify-center gap-1 text-center">
          {isFullscreen && (
            <>
              <span className="text-sm font-semibold truncate" title={selectedRegion ?? "Todas las regiones"}>
                {selectedRegion ?? "Todas las regiones"}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground truncate" title={selectedDependencia ?? "Todas las Dependencias"}>
                {selectedDependencia ?? "Todas las Dependencias"}
              </span>
            </>
          )}
        </div>

        <div className="flex gap-2 shrink-0 items-center">
          {action && <>{action}</>}
          {isFullscreen && (
            <Button variant="default" onClick={onClose} className="cursor-pointer">
              Cerrar
            </Button>
          )}
        </div>
      </div>

      <div className={"w-full grow min-h-0 flex items-center justify-center"}>
        {children}
      </div>

      <div className="w-full flex h-[32px] gap-8 p-1  items-center justify-end ">
        {footer && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="ghost">
                  <InfoIcon className={"text-gray-400"} />
                </Button>
              }
            ></TooltipTrigger>
            <TooltipContent>
              <p>{footer}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </Item>
  );
}
