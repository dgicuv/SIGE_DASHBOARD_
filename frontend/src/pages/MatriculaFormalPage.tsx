import { useState, useEffect } from "react";
import { CustomChart } from "@/custom-components/CustomChart";
import { apiFetch } from "@/lib/api";
import { useAppData } from "@/contexts/appData";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

const TODAS_REGIONES = "Todas las Regiones";
const TODAS_DEPENDENCIAS = "Todas las Dependencias";

export default function MatriculaFormalPage() {
  const [region, setRegion] = useState<string>(TODAS_REGIONES);
  const [dependencia, setDependencia] = useState<string>(TODAS_DEPENDENCIAS);
  const [busqueda, setBusqueda] = useState<string>("");
  const { regiones, dependencias } = useAppData();

  const selectedRegionId = regiones.find((r) => r.name === region)?.id ?? null;

  const dependenciasFiltradas = (selectedRegionId === null
    ? dependencias
    : dependencias.filter((d) => d.regionId === selectedRegionId)
  ).toSorted((a, b) => a.clave.localeCompare(b.clave));

  const dependenciasMostradas = busqueda.trim()
    ? dependenciasFiltradas.filter((d) =>
        `${d.clave} ${d.name} ${d.regionName}`.toLowerCase().includes(busqueda.toLowerCase())
      )
    : dependenciasFiltradas;

  const selectedDependenciaId =
    dependencia === TODAS_DEPENDENCIAS
      ? null
      : dependencias.find((d) => `${d.clave} - ${d.name} - ${d.regionName}` === dependencia)?.id ?? null;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (selectedRegionId !== null) params.set("idRegion", String(selectedRegionId));
    if (selectedDependenciaId !== null) params.set("idDependencia", String(selectedDependenciaId));
    const query = params.size > 0 ? `?${params}` : "";

    apiFetch(`/api/v1/matricula/graficas/discapacidad-por-area-academica${query}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => console.log("[discapacidad-por-area-academica]", data))
      .catch((err) => { if (err.name !== "AbortError") console.error("[discapacidad-por-area-academica]", err); });

    return () => controller.abort();
  }, [selectedRegionId, selectedDependenciaId]);

  function handleRegionChange(val: string | null) {
    if (!val) return;
    setRegion(val);
    setDependencia(TODAS_DEPENDENCIAS);
    setBusqueda("");
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[30%_70%] gap-2 px-4 pt-4">
        <Combobox value={region} onValueChange={handleRegionChange} className="w-full">
          <ComboboxInput placeholder={TODAS_REGIONES} className="w-full" readOnly />
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
          onValueChange={(val) => { setDependencia(val ?? TODAS_DEPENDENCIAS); setBusqueda(""); }}
          className="w-full"
        >
          <ComboboxTrigger className="flex h-9 w-full items-center justify-between rounded-2xl border border-input bg-background px-3 shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground">
            <span className={cn("truncate text-sm", dependencia === TODAS_DEPENDENCIAS && "text-muted-foreground")}>
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
              <ComboboxItem value={TODAS_DEPENDENCIAS}>{TODAS_DEPENDENCIAS}</ComboboxItem>
              {dependenciasMostradas.map((d) => {
                const label = `${d.clave} - ${d.name} - ${d.regionName}`;
                return (
                  <ComboboxItem key={d.id} value={label}>
                    {label}
                  </ComboboxItem>
                );
              })}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="flex flex-wrap content-start gap-0 p-2">
        <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={["dashboard", "entidades", region]}
            queryFn={({ signal }) =>
              apiFetch("/api/v1/entidadesdependencias/entidades", { signal }).then((r) => r.json())
            }
            colors={["#70AB6D"]}
          />
        </div>
        <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={["dashboard", "personal", region]}
            queryFn={({ signal }) =>
              apiFetch("/api/v1/entidadesdependencias/personal", { signal }).then((r) => r.json())
            }
            colors={["#C8796F"]}
            orientation="vertical"
          />
        </div>
        <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={["dashboard", "personal2", region]}
            queryFn={({ signal }) =>
              apiFetch("/api/v1/entidadesdependencias/personal", { signal }).then((r) => r.json())
            }
            colors={["#C8796F"]}
            orientation="vertical"
          />
        </div>
      </div>
    </div>
  );
}
