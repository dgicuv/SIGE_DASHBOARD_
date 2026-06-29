import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { StatItem } from "@/components/StatItem";
import { BookOpen, Building2, Layers, MilestoneIcon } from "lucide-react";
import { useRegionDependenciaFilter } from "@/hooks/useRegionDependenciaFilter";
import { RegionDependenciaFilter } from "@custom/RegionDependenciaFilter";
import { CustomChart } from "@custom/CustomChart";
import { mapPieDataField } from "@/lib/pieChartUtils";

type Estadistica = {
  totalProgramasEducativos: number;
  totalAreasAcademicas: number;
  totalModalidades: number;
  totalNiveles: number;
};

function buildQuery(idRegion: number | null, idDependencia: number | null) {
  const params = new URLSearchParams();
  if (idRegion !== null) params.set("idRegion", String(idRegion));
  if (idDependencia !== null) params.set("idDependencia", String(idDependencia));
  return params.size > 0 ? `?${params}` : "";
}

export default function ProgramasEducativosPage() {
  const filter = useRegionDependenciaFilter();
  const {
    selectedRegionId,
    selectedDependenciaId,
    selectedRegionName,
    selectedDependenciaName,
  } = filter;

  const { data: estadistica, isLoading: estadisticaLoading } =
    useQuery<Estadistica>({
      queryKey: ["programas-educativos", "estadistica", selectedRegionId, selectedDependenciaId],
      queryFn: ({ signal }) =>
        apiFetch(`/api/v1/programaseducativos/graficas/estadistica${buildQuery(selectedRegionId, selectedDependenciaId)}`, { signal })
          .then((r) => r.json()),
    });

  return (
    <div className="flex flex-col gap-0">
      <RegionDependenciaFilter {...filter} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4">
        <StatItem
          titulo="Programas Educativos"
          icon={<BookOpen className="size-8" />}
          description={estadistica?.totalProgramasEducativos ?? "—"}
          loading={estadisticaLoading}
          className="text-orange-500"
        />
        <StatItem
          titulo="Áreas Académicas"
          icon={<Building2 className="size-8" />}
          description={estadistica?.totalAreasAcademicas ?? "—"}
          loading={estadisticaLoading}
          className="text-blue-400"
        />
        <StatItem
          titulo="Modalidades"
          icon={<Layers className="size-8" />}
          description={estadistica?.totalModalidades ?? "—"}
          loading={estadisticaLoading}
          className="text-emerald-500"
        />
        <StatItem
          titulo="Niveles"
          icon={<MilestoneIcon className="size-8" />}
          description={estadistica?.totalNiveles ?? "—"}
          loading={estadisticaLoading}
          className="text-purple-500"
        />
      </div>

      <div className="flex flex-wrap content-start gap-0 p-2">
        <div className="w-full lg:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={["programas-educativos", "distribucion-por-area-academica", selectedRegionId, selectedDependenciaId]}
            queryFn={({ signal }) =>
              apiFetch(`/api/v1/programaseducativos/graficas/distribucion-por-area-academica${buildQuery(selectedRegionId, selectedDependenciaId)}`, { signal })
                .then((r) => r.json())
                .then((raw) => mapPieDataField(raw, "groupBy"))
            }
            selectedRegion={selectedRegionName}
            selectedDependencia={selectedDependenciaName}
            colorTheme="nord"
            allowedModesDefault={["graph", "data"]}
            allowedModesRegion={["graph", "data"]}
            allowedModesDependencia={["graph", "data"]}
          />
        </div>

        <div className="w-full lg:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={["programas-educativos", "distribucion-por-region", selectedRegionId, selectedDependenciaId]}
            queryFn={({ signal }) =>
              apiFetch(`/api/v1/programaseducativos/graficas/distribucion-por-region${buildQuery(selectedRegionId, selectedDependenciaId)}`, { signal })
                .then((r) => r.json())
                .then((raw) => mapPieDataField(raw, "groupBy"))
            }
            selectedRegion={selectedRegionName}
            selectedDependencia={selectedDependenciaName}
            colorTheme="kanagawa"
            allowedModesDefault={["graph", "data"]}
            allowedModesRegion={["data"]}
            allowedModesDependencia={["data"]}
          />
        </div>

        <div className="w-full lg:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={["programas-educativos", "distribucion-por-modalidad", selectedRegionId, selectedDependenciaId]}
            queryFn={({ signal }) =>
              apiFetch(`/api/v1/programaseducativos/graficas/distribucion-por-modalidad${buildQuery(selectedRegionId, selectedDependenciaId)}`, { signal })
                .then((r) => r.json())
                .then((raw) => mapPieDataField(raw, "groupBy"))
            }
            chartType="bar"
            selectedRegion={selectedRegionName}
            selectedDependencia={selectedDependenciaName}
            colorTheme="monokai"
            allowedModesDefault={["graph", "data"]}
            allowedModesRegion={["graph", "data"]}
            allowedModesDependencia={["graph", "data"]}
          />
        </div>

        <div className="w-full lg:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={["programas-educativos", "distribucion-por-nivel", selectedRegionId, selectedDependenciaId]}
            queryFn={({ signal }) =>
              apiFetch(`/api/v1/programaseducativos/graficas/distribucion-por-nivel${buildQuery(selectedRegionId, selectedDependenciaId)}`, { signal })
                .then((r) => r.json())
                .then((raw) => mapPieDataField(raw, "groupBy"))
            }
            chartType="bar"
            selectedRegion={selectedRegionName}
            selectedDependencia={selectedDependenciaName}
            colorTheme="gruvboxDark"
            allowedModesDefault={["graph", "data"]}
            allowedModesRegion={["graph", "data"]}
            allowedModesDependencia={["graph", "data"]}
          />
        </div>
      </div>
    </div>
  );
}
