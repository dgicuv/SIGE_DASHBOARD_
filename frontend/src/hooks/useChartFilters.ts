import { useMemo, useState } from "react";

export type FilterAccessor<T> = {
    get: (row: T) => string;
    sort?: (a: string, b: string) => number;
    /** Adds a synthetic "Todos" option that matches every row, for fields with no real catch-all row in the data. */
    allowAll?: boolean;
};

export function useChartFilters<T>(rows: T[], accessors: Record<string, FilterAccessor<T>>) {
    const [selected, setSelected] = useState<Record<string, string | null>>({});

    const availableValues = useMemo(() => {
        const result: Record<string, string[]> = {};
        for (const [key, accessor] of Object.entries(accessors)) {
            const values = Array.from(new Set(rows.map(accessor.get)));
            if (accessor.allowAll && !values.includes("Todos")) values.push("Todos");
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

    const clearFilters = () => setSelected({});

    const filteredRows = useMemo(
        () => rows.filter((row) =>
            Object.entries(accessors).every(([key, accessor]) =>
                (accessor.allowAll && selectedValues[key] === "Todos") || accessor.get(row) === selectedValues[key]
            )
        ),
        [rows, accessors, selectedValues],
    );

    const hasActiveFilters = useMemo(
        () => Object.keys(accessors).some((key) => selectedValues[key] !== (availableValues[key]?.[0] ?? "")),
        [accessors, availableValues, selectedValues],
    );

    return { availableValues, selectedValues, setFilter, clearFilters, filteredRows, hasActiveFilters };
}