import {Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList} from "@/components/ui/combobox.tsx";

export type FilterYearProps = {
    setYear: (value: string | null) => void
    availableYear: Array<string>
    selectedYear: string | null | undefined
}

export function FilterYear({setYear, availableYear, selectedYear}: FilterYearProps) {

    return (
        <>
            <Combobox value={selectedYear} onValueChange={(val) => setYear(val)}>
                <ComboboxInput placeholder="Años" className="w-40" readOnly/>
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


        </>
    )

}