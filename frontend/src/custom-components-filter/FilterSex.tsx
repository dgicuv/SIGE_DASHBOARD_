import {Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList} from "@/components/ui/combobox.tsx";
import {Label} from "@/components/ui/label.tsx";

export type FilterSexProps = {
    setSex: (value: string | null) => void
    availableSex: Array<string>
    selectedSex: string | null | undefined
}

export function FilterSex({setSex, availableSex, selectedSex}: FilterSexProps) {

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor="filter-sex">Sexo</Label>
            <Combobox value={selectedSex} onValueChange={(val) => setSex(val)}>
                <ComboboxInput
                    id="filter-sex"
                    placeholder="Sexo"
                    className="w-60 mt-2"
                    readOnly
                    aria-invalid={selectedSex !== availableSex[0]}

                />
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
        </div>
    )

}