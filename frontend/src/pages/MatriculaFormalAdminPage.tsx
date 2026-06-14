import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Download, FileSpreadsheet, Upload } from "lucide-react";
import { toast } from "sonner";
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
import { Separator } from "@/components/ui/separator";


function downloadTemplate() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, "formato_sige.xlsx");
}

export default function MatriculaFormalAdminPage() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [confirmDownload, setConfirmDownload] = useState(false);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0] ?? null;
        if (selected && !selected.name.match(/\.(xlsx|xls)$/i)) {
            toast.error("Solo se aceptan archivos .xlsx o .xls");
            return;
        }
        setFile(selected);
    }

    async function handleUpload() {
        if (!file) return;
        setUploading(true);
        try {
            // TODO: enviar archivo al backend
            await new Promise((r) => setTimeout(r, 800));
            toast.success("Datos actualizados correctamente");
            setFile(null);
            if (inputRef.current) inputRef.current.value = "";
        } catch {
            toast.error("Error al subir el archivo");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="p-6 flex flex-col gap-4">

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="font-heading font-medium text-base">Actualizar datos</h2>
                </div>
                <div>
                    <Button variant="outline" size="sm" onClick={() => setConfirmDownload(true)}>
                        <Download className="size-4" />
                        Descargar formato
                    </Button>
                </div>
            </div>
            <p className="text-sm text-muted-foreground">
                Sube el archivo Excel con los datos nuevos. Solo se aceptan archivos
                <strong> .xlsx</strong> o <strong>.xls</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
                Al cargar un nuevo archivo, los datos de las siguientes gráficas y
                estadísticas serán reemplazados:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Discapacidad por área académica</li>
                <li>Trayectoria académica por nivel educativo</li>
                <li>Matrícula total por programa educativo</li>
                <li>Distribución por movilidad</li>
                <li>Hablantes de lengua indígena</li>
                <li>Estadísticas generales de la sección</li>
            </ul>

            <Separator />

            <div
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border p-12 text-center text-muted-foreground cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => inputRef.current?.click()}
            >
                <FileSpreadsheet className="size-10 text-muted-foreground/60" />
                {file ? (
                    <p className="text-sm text-foreground font-medium">{file.name}</p>
                ) : (
                    <p className="text-sm">
                        Haz clic para seleccionar un archivo
                        <br />
                        <span className="text-xs">.xlsx / .xls</span>
                    </p>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            <div className="flex justify-end">
                <Button onClick={handleUpload} disabled={!file || uploading}>
                    <Upload className="size-4" />
                    {uploading ? "Subiendo..." : "Subir y actualizar"}
                </Button>
            </div>

            <AlertDialog open={confirmDownload} onOpenChange={setConfirmDownload}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Descargar formato de ejemplo</AlertDialogTitle>
                        <AlertDialogDescription className="sr-only">
                            Confirmación de descarga de formato
                        </AlertDialogDescription>
                        <div className="text-sm text-muted-foreground">
                            <p className="mb-3">Se descargará el archivo <strong className="text-foreground">formato_sige.xlsx</strong>.</p>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { downloadTemplate(); setConfirmDownload(false); }}>
                            <Download className="size-4" />
                            Descargar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}
