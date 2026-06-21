import { useMemo, useState } from "react";

export type FilterAccessor<T> = {
    get: (row: T) => string;
    sort?: (a: string, b: string) => number;
};

export function useChartFilters<T>(rows: T[], accessors: Record<string, FilterAccessor<T>>) {
    const [selected, setSelected] = useState<Record<string, string | null>>({});

    const availableValues = useMemo(() => {
        const result: Record<string, string[]> = {};
        for (const [key, accessor] of Object.entries(accessors)) {
            const values = Array.from(new Set(rows.map(accessor.get)));
            result[key] = accessor.sort ? values.sort(accessor.sort) : values.sort();
        }
        return result;
    }, [rows, accessors]);

    const selectedValues = useMemo(() => {
        const result: Record<string, string> = {};
        for (const key of Object.keys(accessors)) {
            const available = availableValues[key] ?? [];
            result[key] = selected[key] ?? (available.includes("Todos") ? "Todos" : available[0] ?? "");
        }
        return result;
    }, [accessors, availableValues, selected]);

    const setFilter = (key: string, value: string | null) => {
        setSelected((prev) => ({ ...prev, [key]: value }));
    };

    const filteredRows = useMemo(
        () => rows.filter((row) =>
            Object.entries(accessors).every(([key, accessor]) => accessor.get(row) === selectedValues[key])
        ),
        [rows, accessors, selectedValues],
    );

    return { availableValues, selectedValues, setFilter, filteredRows };
}