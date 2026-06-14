import { useState } from "react";
import { CustomChart } from "@/custom-components/CustomChart";
import { apiFetch } from "@/lib/api";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppData } from "@/contexts/appData";

export default function MatriculaFormalPage() {
  const [region, setRegion] = useState<string>("todas");
  const { regiones } = useAppData();

  return (
    <div className="flex flex-col gap-0">
      <div className="px-4 pt-4">
        <ToggleGroup
          value={region}
          onValueChange={(val) => { if (val) setRegion(val); }}
          spacing={0}
          variant="outline"
        >
          <ToggleGroupItem value="todas">Todas</ToggleGroupItem>
          {regiones.map((r) => (
            <ToggleGroupItem key={r.id} value={String(r.id)}>
              {r.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
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
