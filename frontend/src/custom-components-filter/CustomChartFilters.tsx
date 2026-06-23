import {FilterSex} from "@/custom-components-filter/FilterSex.tsx";
import {FilterYear} from "@/custom-components-filter/FilterYear.tsx";
import {FilterNivelEducativo} from "@/custom-components-filter/FilterNivelEducativo.tsx";
import {FilterModalidad} from "@/custom-components-filter/FilterModalidad.tsx";

export type CustomChartFiltersProps = {
    available: string[];
    availableValues: Record<string, string[]>;
    selectedValues: Record<string, string>;
    setFilter: (key: string, value: string | null) => void;
};

export function CustomChartFilters({available, availableValues, selectedValues, setFilter}: CustomChartFiltersProps) {
    return (
        <>
            {available.includes("sex") && (
                <FilterSex
                    setSex={(value) => setFilter("sex", value)}
                    availableSex={availableValues.sex ?? []}
                    selectedSex={selectedValues.sex}
                />
            )}
            {available.includes("years") && (
                <FilterYear
                    setYear={(value) => setFilter("years", value)}
                    availableYear={availableValues.years ?? []}
                    selectedYear={selectedValues.years}
                />
            )}
            {available.includes("nivelEducativo") && (
                <FilterNivelEducativo
                    setNivelEducativo={(value) => setFilter("nivelEducativo", value)}
                    availableNivelEducativo={availableValues.nivelEducativo ?? []}
                    selectedNivelEducativo={selectedValues.nivelEducativo}
                />
            )}
            {available.includes("modalidad") && (
                <FilterModalidad
                    setModalidad={(value) => setFilter("modalidad", value)}
                    availableModalidad={availableValues.modalidad ?? []}
                    selectedModalidad={selectedValues.modalidad}
                />
            )}
        </>
    );
}