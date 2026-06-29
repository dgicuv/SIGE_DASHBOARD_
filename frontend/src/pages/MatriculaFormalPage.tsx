import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { StatItem } from "@/components/StatItem";
import {
  AccessibilityIcon,
  GraduationCap,
  MarsIcon,
  NonBinary,
  SpeechIcon,
  VenusIcon,
} from "lucide-react";
import { CustomChart } from "@custom/CustomChart.tsx";
import { mapPieDataField } from "@/lib/pieChartUtils.ts";
import { useRegionDependenciaFilter } from "@/hooks/useRegionDependenciaFilter";
import { RegionDependenciaFilter } from "@custom/RegionDependenciaFilter";

type Estadistica = {
  totalMatricula: number;
  totalDiscapacidad: number;
  totalLenguaIndigena: number;
  totalHombres: number;
  totalMujeres: number;
  totalNoBinario: number;
};

export default function MatriculaFormalPage() {
  const filter = useRegionDependenciaFilter();
  const {
    selectedRegionId,
    selectedDependenciaId,
    selectedRegionName,
    selectedDependenciaName,
  } = filter;

  const { data: estadistica, isLoading: estadisticaLoading } =
    useQuery<Estadistica>({
      queryKey: [
        "matricula",
        "estadistica",
        selectedRegionId,
        selectedDependenciaId,
      ],
      queryFn: ({ signal }) => {
        const params = new URLSearchParams();
        if (selectedRegionId !== null)
          params.set("idRegion", String(selectedRegionId));
        if (selectedDependenciaId !== null)
          params.set("idDependencia", String(selectedDependenciaId));
        const query = params.size > 0 ? `?${params}` : "";
        return apiFetch(
          `/api/v1/matriculaformal/graficas/estadistica${query}`,
          { signal },
        ).then((r) => r.json());
      },
    });

  return (
    <div className="flex flex-col gap-0">
      <RegionDependenciaFilter {...filter} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
        <StatItem
          titulo="Matrícula"
          icon={<GraduationCap className="size-8" />}
          description={estadistica?.totalMatricula ?? "—"}
          loading={estadisticaLoading}
          className="text-orange-500"
        />
        <StatItem
          titulo="Discapacidad"
          icon={<AccessibilityIcon className="size-8" />}
          description={estadistica?.totalDiscapacidad ?? "—"}
          loading={estadisticaLoading}
          className="text-blue-400"
        />
        <StatItem
          titulo="Lengua Indígena"
          icon={<SpeechIcon className="size-8" />}
          description={estadistica?.totalLenguaIndigena ?? "—"}
          loading={estadisticaLoading}
          className="text-rose-700"
        />
        <StatItem
          titulo="Hombres"
          icon={<MarsIcon className="size-8" />}
          description={estadistica?.totalHombres ?? "—"}
          loading={estadisticaLoading}
          className="text-cyan-500"
        />
        <StatItem
          titulo="Mujeres"
          icon={<VenusIcon className="size-8" />}
          description={estadistica?.totalMujeres ?? "—"}
          loading={estadisticaLoading}
          className="text-pink-500"
        />
        <StatItem
          titulo="No binario"
          icon={<NonBinary className="size-8" />}
          description={estadistica?.totalNoBinario ?? "—"}
          loading={estadisticaLoading}
          className="text-purple-500"
        />
      </div>

      <div className="flex flex-wrap content-start gap-0 p-2">
        <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={[
              "dashboard",
              "discapacidad-por-area-academica",
              selectedRegionId,
              selectedDependenciaId,
            ]}
            queryFn={({ signal }) => {
              const params = new URLSearchParams();
              if (selectedRegionId !== null)
                params.set("idRegion", String(selectedRegionId));
              if (selectedDependenciaId !== null)
                params.set("idDependencia", String(selectedDependenciaId));
              const query = params.size > 0 ? `?${params}` : "";
              return apiFetch(
                `/api/v1/matriculaformal/graficas/discapacidad-por-area-academica${query}`,
                { signal },
              )
                .then((r) => r.json())
                .then((raw) => mapPieDataField(raw, "groupBy"));
            }}
            selectedRegion={selectedRegionName}
            selectedDependencia={selectedDependenciaName}
            colorTheme={"kanagawa"}
            allowedModesDefault={["graph", "data"]}
            allowedModesRegion={["graph", "data"]}
            allowedModesDependencia={["graph", "data"]}
          />
        </div>

        <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={[
              "dashboard",
              "matricula-por-programa-educativo",
              selectedRegionId,
              selectedDependenciaId,
            ]}
            queryFn={async ({ signal }) => {
              const params = new URLSearchParams();
              if (selectedRegionId !== null)
                params.set("idRegion", String(selectedRegionId));
              if (selectedDependenciaId !== null)
                params.set("idDependencia", String(selectedDependenciaId));
              const query = params.size > 0 ? `?${params}` : "";
              return apiFetch(
                `/api/v1/matriculaformal/graficas/matricula-por-programa-educativo${query}`,
                { signal },
              )
                .then((r) => r.json())
                .then((raw) => mapPieDataField(raw, "groupBy"));
            }}
            selectedRegion={selectedRegionName}
            selectedDependencia={selectedDependenciaName}
            colorTheme={"kanagawa"}
            allowedModesDefault={["data"]}
            allowedModesRegion={["data"]}
            allowedModesDependencia={["data"]}
          />
        </div>

        <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={[
              "dashboard",
              "hablantes-lengua-indigena",
              selectedRegionId,
              selectedDependenciaId,
            ]}
            queryFn={async ({ signal }) => {
              const params = new URLSearchParams();
              if (selectedRegionId !== null)
                params.set("idRegion", String(selectedRegionId));
              if (selectedDependenciaId !== null)
                params.set("idDependencia", String(selectedDependenciaId));
              const query = params.size > 0 ? `?${params}` : "";
              return apiFetch(
                `/api/v1/matriculaformal/graficas/hablantes-lengua-indigena${query}`,
                { signal },
              )
                .then((r) => r.json())
                .then((raw) => mapPieDataField(raw, "groupBy"));
            }}
            selectedRegion={selectedRegionName}
            selectedDependencia={selectedDependenciaName}
            colorTheme={"barman"}
            allowedModesDefault={["data", "graph"]}
            allowedModesRegion={["data"]}
            allowedModesDependencia={["data"]}
          />
        </div>

        <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={[
              "dashboard",
              "movilidad-por-nivel-educativo",
              selectedRegionId,
              selectedDependenciaId,
            ]}
            queryFn={async ({ signal }) => {
              const params = new URLSearchParams();
              if (selectedRegionId !== null)
                params.set("idRegion", String(selectedRegionId));
              if (selectedDependenciaId !== null)
                params.set("idDependencia", String(selectedDependenciaId));
              const query = params.size > 0 ? `?${params}` : "";
              return apiFetch(
                `/api/v1/matriculaformal/graficas/movilidad-por-nivel-educativo${query}`,
                { signal },
              )
                .then((r) => r.json())
                .then((raw) => mapPieDataField(raw, "groupBy"));
            }}
            chartType="bar"
            seriesField="tipo"
            selectedRegion={selectedRegionName}
            selectedDependencia={selectedDependenciaName}
            colorTheme={"barman"}
            allowedModesDefault={["data", "graph"]}
            allowedModesRegion={["data", "graph"]}
            allowedModesDependencia={["data", "graph"]}
          />
        </div>

        <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
          <CustomChart
            queryKey={[
              "dashboard",
              "trayectoria-academica-por-nivel-educativo",
              selectedRegionId,
              selectedDependenciaId,
            ]}
            queryFn={async ({ signal }) => {
              const params = new URLSearchParams();
              if (selectedRegionId !== null)
                params.set("idRegion", String(selectedRegionId));
              if (selectedDependenciaId !== null)
                params.set("idDependencia", String(selectedDependenciaId));
              const query = params.size > 0 ? `?${params}` : "";
              return apiFetch(
                `/api/v1/matriculaformal/graficas/trayectoria-academica-por-nivel-educativo${query}`,
                { signal },
              )
                .then((r) => r.json())
                .then((raw) => mapPieDataField(raw, "groupBy"));
            }}
            chartType="bar"
            orientation="vertical"
            seriesField="tipo"
            selectedRegion={selectedRegionName}
            selectedDependencia={selectedDependenciaName}
            colorTheme={"barman"}
            allowedModesDefault={["data", "graph"]}
            allowedModesRegion={["data", "graph"]}
            allowedModesDependencia={["data", "graph"]}
          />
        </div>
      </div>
    </div>
  );
}
