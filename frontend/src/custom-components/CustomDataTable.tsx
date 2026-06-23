import {useMemo, useState} from "react";
import {ArrowDown, ArrowUp, ArrowUpDown, FileDown, Search} from "lucide-react";
import * as XLSX from "xlsx";
import {rankItem} from "@tanstack/match-sorter-utils";
import {
    createColumnHelper,
    type FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {fileTimestamp} from "@/lib/utils";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
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
import type {FormatValuesMode} from "@custom/CustomChartMenu.tsx";

type ValueFormat = "number" | "currency";

type Row = { category: string; value: number; [key: string]: string | number };

export type ExtraColumn = { key: string; header: string; values: readonly string[] };

const formatters: Record<ValueFormat, Intl.NumberFormat> = {
    number: new Intl.NumberFormat("es-MX"),
    currency: new Intl.NumberFormat("es-MX", {style: "currency", currency: "MXN"}),
};

const fuzzyFilter: FilterFn<Row> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({itemRank});
    return itemRank.passed;
};

const columnHelper = createColumnHelper<Row>();

type DataTableProps = {
    title: string;
    subtext?: string;
    categoryLabel?: string;
    categories: readonly string[];
    values: readonly number[];
    extraColumns?: readonly ExtraColumn[];
    valueFormat?: ValueFormat;
    formatValue?: FormatValuesMode;
};

export function CustomDataTable({
                                    title,
                                    subtext,
                                    categoryLabel = "Categoría",
                                    categories,
                                    values,
                                    extraColumns = [],
                                    valueFormat = "number",
                                    formatValue = "numeric",
                                }: DataTableProps) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pendingFormat, setPendingFormat] = useState<"csv" | "xls" | "xlsx" | null>(null);
    const fmt = formatters[valueFormat];
    const total = useMemo(() => values.reduce((sum, value) => sum + value, 0), [values]);

    const data = useMemo<Row[]>(
        () => categories.map((category, i) => {
            const row: Row = {category, value: values[i]};
            for (const col of extraColumns) row[col.key] = col.values[i] ?? "";
            return row;
        }),
        [categories, values, extraColumns],
    );

    const columns = useMemo(
        () => [
            columnHelper.accessor("category", {
                header: categoryLabel,
                filterFn: fuzzyFilter,
            }),
            ...extraColumns.map((col) =>
                columnHelper.accessor(col.key, {
                    header: col.header,
                    cell: (info) => String(info.getValue() ?? ""),
                    filterFn: fuzzyFilter,
                })
            ),
            columnHelper.accessor("value", {
                header: "Valor",
                cell: (info) => formatValue === "percent"
                    ? `${total ? ((Number(info.getValue()) / total) * 100).toFixed(1) : "0"}%`
                    : fmt.format(Number(info.getValue())),
                enableColumnFilter: false,
            }),
        ],
        [fmt, formatValue, total, extraColumns, categoryLabel],
    );

    const table = useReactTable({
        data,
        columns,
        state: {globalFilter, sorting},
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    function exportData(format: "csv" | "xls" | "xlsx") {
        const headerRows = [[title], ...(subtext ? [[subtext], []] : [])];
        const dataRows = [
            [categoryLabel, ...extraColumns.map((c) => c.header), "Valor"],
            ...data.map((r) => [r.category, ...extraColumns.map((c) => r[c.key]), r.value]),
        ];
        const ws = XLSX.utils.aoa_to_sheet([...headerRows, ...dataRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Datos");
        XLSX.writeFile(wb, `${title}_${fileTimestamp()}.${format}`);
    }

    return (
        <div className={`flex flex-col w-full h-full`}>
            <div className="flex flex-col px-4 pt-2">
                <span className="text-sm font-medium">{title}</span>
                {subtext && <span className="text-xs text-muted-foreground">{subtext}</span>}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border-b">
                <div className="relative flex-1">

                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"/>
                    <Input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Buscar categoría..."
                        className="pl-7 h-7 text-sm"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={(props) => (
                            <Button {...props} variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                                <FileDown className="size-3.5"/>
                                Exportar
                            </Button>
                        )}
                    />
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPendingFormat("csv")}>CSV</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPendingFormat("xls")}>XLS</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPendingFormat("xlsx")}>XLSX</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="sticky top-0 bg-background px-4 py-2 font-medium text-muted-foreground text-left last:text-right"
                                >
                                    {header.isPlaceholder ? null : (
                                        <button
                                            type="button"
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground"
                                        >
                                            {String(header.column.columnDef.header)}
                                            {header.column.getIsSorted() === "asc" && <ArrowUp className="size-3"/>}
                                            {header.column.getIsSorted() === "desc" && <ArrowDown className="size-3"/>}
                                            {!header.column.getIsSorted() && <ArrowUpDown className="size-3 opacity-40"/>}
                                        </button>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-b last:border-0 hover:bg-muted/50">
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-2 last:text-right"
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {table.getRowModel().rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground text-sm">
                                Sin resultados
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <AlertDialog open={pendingFormat !== null} onOpenChange={(open) => {
                if (!open) setPendingFormat(null);
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Exportar datos</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se descargará <span className="font-medium text-foreground">{title}</span> como
                            archivo <span className="font-medium text-foreground uppercase">{pendingFormat}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (pendingFormat) exportData(pendingFormat);
                            setPendingFormat(null);
                        }}>
                            Descargar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
