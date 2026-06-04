import { useState } from "react";
import { Settings } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export type ChartMode = "bar" | "line" | "data";

type ChartMenuProps = {
  title: string;
  mode: ChartMode;
  onModeChange: (mode: ChartMode) => void;
  onReset?: () => void;
  onDownload?: () => void;
  onRefetch?: () => void;
};

export function ChartMenu({
  title,
  mode,
  onModeChange,
  onReset,
  onDownload,
  onRefetch,
}: ChartMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={(props) => (
            <Button {...props} variant="outline" className={"cursor-pointer"}>
              <Settings />
            </Button>
          )}
        />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ver como:</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={mode === "bar"}
              className={"cursor-pointer"}
              onClick={() => onModeChange("bar")}
            >
              Gráfica de barras
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className={"cursor-pointer"}
              checked={mode === "line"}
              onClick={() => onModeChange("line")}
            >
              Gráfica de líneas
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className={"cursor-pointer"}
              checked={mode === "data"}
              onClick={() => onModeChange("data")}
            >
              Tabla de datos
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onReset} className={"cursor-pointer"}>
              Restaurar vista
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setConfirmOpen(true)}
              className={"cursor-pointer"}
            >
              Descargar imagen
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onRefetch} className={"cursor-pointer"}>
              Volver a obtener datos
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

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

type CardGraphProps = {
  title: string;
  footer: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function CardGraph({ title, footer, action, children }: CardGraphProps) {
  return (
    <Card size="default" className="">
      <CardHeader>
        <CardTitle className="">{title}</CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <p className="text-xs text-gray-400">{footer}</p>
      </CardFooter>
    </Card>
  );
}
