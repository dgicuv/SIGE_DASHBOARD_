import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxInput,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import type { useRegionDependenciaFilter } from "@/hooks/useRegionDependenciaFilter";

type Props = ReturnType<typeof useRegionDependenciaFilter>;

export function RegionDependenciaFilter({
  region,
  dependencia,
  busqueda,
  setBusqueda,
  regiones,
  dependenciasMostradas,
  handleRegionChange,
  handleDependenciaChange,
  TODAS_REGIONES,
  TODAS_DEPENDENCIAS,
}: Props) {
  return (
    <div className="sticky top-12 z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[30%_70%] gap-2 px-4 pt-4 pb-4 bg-stone-200 dark:bg-stone-600 border-b border-primary/30 shadow-md">
      <Combobox value={region} onValueChange={handleRegionChange}>
        <ComboboxInput
          placeholder={TODAS_REGIONES}
          className="w-full bg-white dark:bg-black"
          readOnly
          aria-invalid={region !== TODAS_REGIONES}
        />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem value={TODAS_REGIONES}>{TODAS_REGIONES}</ComboboxItem>
            {regiones.map((r) => (
              <ComboboxItem key={r.id} value={r.name}>
                {r.name}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Combobox
        value={dependencia}
        onValueChange={handleDependenciaChange}
      >
        <ComboboxTrigger
          aria-invalid={dependencia !== TODAS_DEPENDENCIAS}
          className="flex h-9 w-full items-center justify-between rounded-2xl border border-input bg-background px-3 shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        >
          <span
            className={cn(
              "truncate text-sm",
              dependencia === TODAS_DEPENDENCIAS && "text-muted-foreground",
            )}
          >
            {dependencia}
          </span>
        </ComboboxTrigger>
        <ComboboxContent>
          <div className="p-1 pb-0">
            <input
              placeholder="Buscar dependencia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="flex h-8 w-full rounded-xl border border-input/30 bg-input/50 px-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ComboboxList>
            <ComboboxItem value={TODAS_DEPENDENCIAS}>
              {TODAS_DEPENDENCIAS}
            </ComboboxItem>
            {dependenciasMostradas.map((d) => (
              <ComboboxItem
                key={d.id}
                value={`${d.clave} - ${d.name} - ${d.regionName}`}
              >
                <div className="flex items-center gap-2 min-w-0 w-full">
                  <span
                    className="truncate flex-1"
                    title={`${d.clave} - ${d.name}`}
                  >
                    {d.clave} - {d.name}
                  </span>
                  <span
                    className="text-xs text-muted-foreground shrink-0"
                    title={d.regionName}
                  >
                    {d.regionName}
                  </span>
                </div>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
