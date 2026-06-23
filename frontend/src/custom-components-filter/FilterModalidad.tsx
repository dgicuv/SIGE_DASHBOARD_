import {Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList} from "@/components/ui/combobox.tsx";
import {Label} from "@/components/ui/label.tsx";

export type FilterModalidadProps = {
    setModalidad: (value: string | null) => void
    availableModalidad: Array<string>
    selectedModalidad: string | null | undefined
}

export function FilterModalidad({setModalidad, availableModalidad, selectedModalidad}: FilterModalidadProps) {

    return (
        <div className="flex flex-col gap-1 mt-2">
            <Label htmlFor="filter-modalidad">Modalidad</Label>
            <Combobox value={selectedModalidad} onValueChange={(val) => setModalidad(val)}>
                <ComboboxInput
                    id="filter-modalidad"
                    placeholder="Modalidad"
                    className="w-60 mt-2"
                    readOnly
                    aria-invalid={selectedModalidad !== availableModalidad[0]}
                />
                <ComboboxContent>
                    <ComboboxList>
                        {availableModalidad.map((g) => (
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
