import {Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList} from "@/components/ui/combobox.tsx";
import {Label} from "@/components/ui/label.tsx";

export type FilterYearProps = {
    setYear: (value: string | null) => void
    availableYear: Array<string>
    selectedYear: string | null | undefined
}

export function FilterYear({setYear, availableYear, selectedYear}: FilterYearProps) {

    return (
        <div className="flex flex-col gap-1 mt-2">
            <Label htmlFor="filter-year">Año</Label>
            <Combobox value={selectedYear} onValueChange={(val) => setYear(val)}>
                <ComboboxInput id="filter-year" placeholder="Años" className="w-60 mt-2" readOnly/>
                <ComboboxContent>
                    <ComboboxList>
                        {availableYear.map((g) => (
                            <ComboboxItem key={g} value={g}>
                                {g}
                            </ComboboxItem>
                        ))}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    )

}