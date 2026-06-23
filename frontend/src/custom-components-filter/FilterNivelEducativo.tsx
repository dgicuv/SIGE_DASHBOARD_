import {Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList} from "@/components/ui/combobox.tsx";
import {Label} from "@/components/ui/label.tsx";

export type FilterNivelEducativoProps = {
    setNivelEducativo: (value: string | null) => void
    availableNivelEducativo: Array<string>
    selectedNivelEducativo: string | null | undefined
}

export function FilterNivelEducativo({setNivelEducativo, availableNivelEducativo, selectedNivelEducativo}: FilterNivelEducativoProps) {

    return (
        <div className="flex flex-col gap-1 mt-2">
            <Label htmlFor="filter-nivel-educativo">Nivel Educativo</Label>
            <Combobox value={selectedNivelEducativo} onValueChange={(val) => setNivelEducativo(val)}>
                <ComboboxInput
                    id="filter-nivel-educativo"
                    placeholder="Nivel Educativo"
                    className="w-60 mt-2"
                    readOnly
                    aria-invalid={selectedNivelEducativo !== availableNivelEducativo[0]}
                />
                <ComboboxContent>
                    <ComboboxList>
                        {availableNivelEducativo.map((g) => (
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
