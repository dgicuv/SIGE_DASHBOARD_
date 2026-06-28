import { useState } from "react";
import { EllipsisVerticalIcon, Maximize2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type FormatValuesMode = "numeric" | "percent";
export type ChartMode = "graph" | "data";

type ChartMenuProps = {
  title: string;
  onReset?: () => void;
  mode: ChartMode;
  onModeChange: (mode: ChartMode) => void;
  allowedModes?: ChartMode[];
  formatValue: FormatValuesMode;
  onDownload: () => void;
  setIsFullscreen: () => void;
  isFullscreen?: boolean;
  setFormatValue: (format: FormatValuesMode) => void;
};

export function CustomChartMenu({
  mode,
  title,
  onModeChange,
  allowedModes = ["graph", "data"],
  formatValue,
  setFormatValue,
  onReset,
  onDownload,
  setIsFullscreen,
  isFullscreen = false,
}: ChartMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger
          render={(props) => (
            <Button
              {...props}
              variant="outline"
              size={"icon"}
              className={"cursor-pointer"}
            >
              <EllipsisVerticalIcon />
            </Button>
          )}
        />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ver como:</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={formatValue === "numeric"}
              className={"cursor-pointer"}
              onClick={() => {
                setFormatValue("numeric");
                setMenuOpen(false);
              }}
            >
              Valores numéricos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className={"cursor-pointer"}
              checked={formatValue === "percent"}
              onClick={() => {
                setFormatValue("percent");
                setMenuOpen(false);
              }}
            >
              Valores porcentuales
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          {allowedModes.length > 1 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {allowedModes.includes("graph") && (
                  <DropdownMenuCheckboxItem
                    checked={mode === "graph"}
                    onClick={() => {
                      onReset?.();
                      setMenuOpen(false);
                    }}
                    className={"cursor-pointer"}
                  >
                    Gráfica
                  </DropdownMenuCheckboxItem>
                )}

                {allowedModes.includes("data") && (
                  <DropdownMenuCheckboxItem
                    className={"cursor-pointer"}
                    checked={mode === "data"}
                    onClick={() => {
                      onModeChange("data");
                      setMenuOpen(false);
                    }}
                  >
                    Tabla de datos
                  </DropdownMenuCheckboxItem>
                )}
              </DropdownMenuGroup>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setConfirmOpen(true)}
              disabled={mode === "data" || !allowedModes.includes("graph")}
              className={"cursor-pointer"}
            >
              Descargar imagen
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {!isFullscreen && (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          onClick={setIsFullscreen}
          disabled={isFullscreen}
        >
          <Maximize2 />
        </Button>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={"text-lg"}>
              Descargar imagen
            </AlertDialogTitle>
            <AlertDialogDescription className={"text-sm"}>
              Se descargará{" "}
              <span className="font-medium text-foreground">{title}</span> como
              archivo PNG.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={"text-sm"}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className={"text-sm"}
              onClick={() => {
                onDownload?.();
                setConfirmOpen(false);
              }}
            >
              Descargar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
