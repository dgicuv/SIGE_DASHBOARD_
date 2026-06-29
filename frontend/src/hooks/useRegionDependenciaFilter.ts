import { useState } from "react";
import { useAppData } from "@/contexts/appData";

const TODAS_REGIONES = "Todas las Regiones";
const TODAS_DEPENDENCIAS = "Todas las Dependencias";

export function useRegionDependenciaFilter() {
  const [region, setRegion] = useState<string>(TODAS_REGIONES);
  const [dependencia, setDependencia] = useState<string>(TODAS_DEPENDENCIAS);
  const [busqueda, setBusqueda] = useState<string>("");
  const { regiones, dependencias } = useAppData();

  const selectedRegionId = regiones.find((r) => r.name === region)?.id ?? null;

  const dependenciasFiltradas = (
    selectedRegionId === null
      ? dependencias
      : dependencias.filter((d) => d.regionId === selectedRegionId)
  ).toSorted((a, b) => a.clave.localeCompare(b.clave));

  const dependenciasMostradas = busqueda.trim()
    ? dependenciasFiltradas.filter((d) =>
        `${d.clave} ${d.name} ${d.regionName}`
          .toLowerCase()
          .includes(busqueda.toLowerCase()),
      )
    : dependenciasFiltradas;

  const selectedDependencia = dependencias.find(
    (d) => `${d.clave} - ${d.name} - ${d.regionName}` === dependencia,
  );
  const selectedDependenciaId = selectedDependencia?.id ?? null;

  const isRegionSelected = selectedRegionId !== null;
  const isDependenciaSelected = selectedDependenciaId !== null;

  function handleRegionChange(val: string | null) {
    if (!val) return;
    setRegion(val);
    setDependencia(TODAS_DEPENDENCIAS);
    setBusqueda("");
  }

  function handleDependenciaChange(val: string | null) {
    setDependencia(val ?? TODAS_DEPENDENCIAS);
    setBusqueda("");
  }

  return {
    // state
    region,
    dependencia,
    busqueda,
    setBusqueda,
    // derived
    regiones,
    dependenciasMostradas,
    selectedRegionId,
    selectedDependenciaId,
    isRegionSelected,
    isDependenciaSelected,
    // display labels para charts
    selectedRegionName: isRegionSelected ? region : undefined,
    selectedDependenciaName: isDependenciaSelected ? dependencia : undefined,
    // handlers
    handleRegionChange,
    handleDependenciaChange,
    // constants
    TODAS_REGIONES,
    TODAS_DEPENDENCIAS,
  };
}
