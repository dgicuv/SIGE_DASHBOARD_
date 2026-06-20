import {Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList} from "@/components/ui/combobox.tsx";

export type FilterSexProps = {
    setSex: (value: string | null) => void
    availableSex: Array<string>
    selectedSex: string | null | undefined
}

export function FilterSex({setSex, availableSex, selectedSex}: FilterSexProps) {

    return (
        <>
            <Combobox value={selectedSex} onValueChange={(val) => setSex(val)}>
                <ComboboxInput placeholder="Sexo" className="w-40" readOnly/>
                <ComboboxContent>
                    <ComboboxList>
                        {availableSex.map((g) => (
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