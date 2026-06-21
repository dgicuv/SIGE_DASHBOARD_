import {useState} from "react";
import {Settings} from "lucide-react";
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
import {Button} from "@/components/ui/button";

export type FormatValuesMode = "numeric" | "percent";
export type ChartMode = "graph" | "data";

type ChartMenuProps = {
    title: string;
    onReset?: () => void;
    mode: ChartMode;
    onModeChange: (mode: ChartMode) => void;
    formatValue: FormatValuesMode
    onDownload: () => void;
    setIsFullscreen: () => void;
    setFormatValue: (format: FormatValuesMode) => void;
};

export function CustomChartMenu({
                                    mode,
                                    title,
                                    onModeChange,
                                    formatValue,
                                    setFormatValue,
                                    onReset,
                                    onDownload,
                                    setIsFullscreen
                                }: ChartMenuProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={(props) => (
                        <Button {...props} variant="outline" className={"cursor-pointer"}>
                            <Settings/>
                        </Button>
                    )}
                />
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Ver como:</DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                            checked={formatValue === "numeric"}
                            className={"cursor-pointer"}
                            onClick={() => setFormatValue("numeric")}
                        >
                            Valores numéricos
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            className={"cursor-pointer"}
                            checked={formatValue === "percent"}
                            onClick={() => setFormatValue("percent")}
                        >
                            Valores porcentuales
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuCheckboxItem

                            checked={mode === "graph"}
                            onClick={onReset} className={"cursor-pointer"}>
                            Gráfica
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuCheckboxItem
                            className={"cursor-pointer"}
                            checked={mode === "data"}
                            onClick={() => onModeChange("data")}
                        >
                            Tabla de datos
                        </DropdownMenuCheckboxItem>

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={setIsFullscreen}
                            className={"cursor-pointer"}
                        >
                            Ver en pantalla completa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setConfirmOpen(true)}
                            className={"cursor-pointer"}
                        >
                            Descargar imagen
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



