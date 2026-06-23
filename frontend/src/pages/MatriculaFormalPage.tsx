import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {apiFetch} from "@/lib/api";
import {useAppData} from "@/contexts/appData";
import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
} from "@/components/ui/combobox";
import {cn} from "@/lib/utils";
import {StatItem} from "@/components/StatItem";
import {AccessibilityIcon, GraduationCap, MarsIcon, NonBinary, SpeechIcon, VenusIcon} from "lucide-react";
import {CustomPieChart} from "@custom/CustomPieChart.tsx";
import {mapPieDataField} from "@/lib/pieChartUtils.ts";

const TODAS_REGIONES = "Todas las Regiones";
const TODAS_DEPENDENCIAS = "Todas las Dependencias";


type Estadistica = {
    totalMatricula: number;
    totalDiscapacidad: number;
    totalLenguaIndigena: number;
    totalHombres: number;
    totalMujeres: number;
    totalNoBinario: number;
};

export default function MatriculaFormalPage() {
    const [region, setRegion] = useState<string>(TODAS_REGIONES);
    const [dependencia, setDependencia] = useState<string>(TODAS_DEPENDENCIAS);
    const [busqueda, setBusqueda] = useState<string>("");
    const {regiones, dependencias} = useAppData();

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

    const isDependenciaSelected = selectedDependenciaId !== null;
    const isRegionSelected = selectedRegionId !== null;

    const {data: estadistica, isLoading: estadisticaLoading} = useQuery<Estadistica>({
        queryKey: ["matricula", "estadistica", selectedRegionId, selectedDependenciaId],
        queryFn: ({signal}) => {
            const params = new URLSearchParams();
            if (selectedRegionId !== null) params.set("idRegion", String(selectedRegionId));
            if (selectedDependenciaId !== null) params.set("idDependencia", String(selectedDependenciaId));
            const query = params.size > 0 ? `?${params}` : "";
            return apiFetch(`/api/v1/matriculaformal/graficas/estadistica${query}`, {signal}).then((r) => r.json());
        },
    });

    function handleRegionChange(val: string | null) {
        if (!val) return;
        setRegion(val);
        setDependencia(TODAS_DEPENDENCIAS);
        setBusqueda("");
    }

    return (
        <div className="flex flex-col gap-0">
            <div
                className="sticky top-12 z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[30%_70%] gap-2 px-4 pt-4 pb-4 bg-background border-b shadow-md">
                <Combobox value={region} onValueChange={handleRegionChange}>
                    <ComboboxInput placeholder={TODAS_REGIONES} className="w-full" readOnly
                                   aria-invalid={region !== TODAS_REGIONES}/>
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
                    onValueChange={(val) => {
                        setDependencia(val ?? TODAS_DEPENDENCIAS);
                        setBusqueda("");
                    }}
                >
                    <ComboboxTrigger
                        aria-invalid={dependencia !== TODAS_DEPENDENCIAS}
                        className="flex h-9 w-full items-center justify-between rounded-2xl border border-input bg-background px-3 shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40">
                        <span
                            className={cn("truncate text-sm", dependencia === TODAS_DEPENDENCIAS && "text-muted-foreground")}>
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
                            {dependenciasMostradas.map((d) => (
                                <ComboboxItem key={d.id} value={`${d.clave} - ${d.name} - ${d.regionName}`}>
                                    <div className="flex flex-col min-w-0">
                                        <span className="truncate">{d.clave} - {d.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{d.regionName}</span>
                                    </div>
                                </ComboboxItem>
                            ))}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                <StatItem titulo="Matrícula" icon={<GraduationCap className="size-8"/>}
                          description={estadistica?.totalMatricula ?? "—"} loading={estadisticaLoading}
                          className="text-orange-500"/>
                <StatItem titulo="Discapacidad" icon={<AccessibilityIcon className="size-8"/>}
                          description={estadistica?.totalDiscapacidad ?? "—"} loading={estadisticaLoading}
                          className="text-blue-400"/>
                <StatItem titulo="Lengua Indígena" icon={<SpeechIcon className="size-8"/>}
                          description={estadistica?.totalLenguaIndigena ?? "—"} loading={estadisticaLoading}
                          className="text-rose-700"/>
                <StatItem titulo="Hombres" icon={<MarsIcon className="size-8"/>}
                          description={estadistica?.totalHombres ?? "—"} loading={estadisticaLoading}
                          className="text-cyan-500"/>
                <StatItem titulo="Mujeres" icon={<VenusIcon className="size-8"/>}
                          description={estadistica?.totalMujeres ?? "—"} loading={estadisticaLoading}
                          className="text-pink-500"/>
                <StatItem titulo="No binario" icon={<NonBinary className="size-8"/>}
                          description={estadistica?.totalNoBinario ?? "—"} loading={estadisticaLoading}
                          className="text-purple-500"/>
            </div>

            <div className="flex flex-wrap content-start gap-0 p-2">


                {/*<div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">*/}
                {/*    <CustomChart*/}
                {/*        queryKey={["dashboard", "entidades", region]}*/}
                {/*        queryFn={({signal}) =>*/}
                {/*            apiFetch("/api/v1/entidadesdependencias/entidades", {signal}).then((r) => r.json())*/}
                {/*        }*/}
                {/*        colors={["#70AB6D"]}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">*/}
                {/*    <CustomChart*/}
                {/*        queryKey={["dashboard", "personal", region]}*/}
                {/*        queryFn={({signal}) =>*/}
                {/*            apiFetch("/api/v1/entidadesdependencias/personal", {signal}).then((r) => r.json())*/}
                {/*        }*/}
                {/*        colors={["#C8796F"]}*/}
                {/*        orientation="vertical"*/}
                {/*    />*/}
                {/*</div>*/}
                <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
                    <CustomPieChart
                        queryKey={["dashboard", "discapacidad-por-area-academica", selectedRegionId, selectedDependenciaId]}
                        queryFn={({signal}) => {
                            const params = new URLSearchParams();
                            if (selectedRegionId !== null) params.set("idRegion", String(selectedRegionId));
                            if (selectedDependenciaId !== null) params.set("idDependencia", String(selectedDependenciaId));
                            const query = params.size > 0 ? `?${params}` : "";
                            return apiFetch(`/api/v1/matriculaformal/graficas/discapacidad-por-area-academica${query}`, {signal})
                                .then((r) => r.json())
                                .then((raw) => mapPieDataField(raw, "groupBy"));
                        }}
                        selectedRegion={isRegionSelected ? region : undefined}
                        selectedDependencia={isDependenciaSelected ? dependencia : undefined}
                        colorTheme={"kanagawa"}
                        allowedModesDefault={["graph", "data"]}
                        allowedModesRegion={["graph", "data"]}
                        allowedModesDependencia={["graph", "data"]}
                    />
                </div>


                <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
                    <CustomPieChart
                        queryKey={["dashboard", "matricula-por-programa-educativo", selectedRegionId, selectedDependenciaId]}
                        queryFn={({signal}) => {
                            const params = new URLSearchParams();
                            if (selectedRegionId !== null) params.set("idRegion", String(selectedRegionId));
                            if (selectedDependenciaId !== null) params.set("idDependencia", String(selectedDependenciaId));
                            const query = params.size > 0 ? `?${params}` : "";
                            return apiFetch(`/api/v1/matriculaformal/graficas/matricula-por-programa-educativo${query}`, {signal})
                                .then((r) => r.json())
                                .then((raw) => mapPieDataField(raw, "groupBy"));
                        }}
                        selectedRegion={isRegionSelected ? region : undefined}
                        selectedDependencia={isDependenciaSelected ? dependencia : undefined}
                        colorTheme={"kanagawa"}
                        allowedModesDefault={["data"]}
                        allowedModesRegion={["data"]}
                        allowedModesDependencia={["data"]}
                    />
                </div>


                <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
                    <CustomPieChart
                        queryKey={["dashboard", "hablantes-lengua-indigena", selectedRegionId, selectedDependenciaId]}
                        queryFn={({signal}) => {
                            const params = new URLSearchParams();
                            if (selectedRegionId !== null) params.set("idRegion", String(selectedRegionId));
                            if (selectedDependenciaId !== null) params.set("idDependencia", String(selectedDependenciaId));
                            const query = params.size > 0 ? `?${params}` : "";
                            return apiFetch(`/api/v1/matriculaformal/graficas/hablantes-lengua-indigena${query}`, {signal})
                                .then((r) => r.json())
                                .then((raw) => mapPieDataField(raw, "groupBy"));
                        }}
                        selectedRegion={isRegionSelected ? region : undefined}
                        selectedDependencia={isDependenciaSelected ? dependencia : undefined}
                        colorTheme={"barman"}
                        allowedModesDefault={["data", "graph"]}
                        allowedModesRegion={["data"]}
                        allowedModesDependencia={["data"]}
                    />
                </div>


                <div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">
                    <CustomPieChart
                        queryKey={["dashboard", "movilidad-por-nivel-educativo", selectedRegionId, selectedDependenciaId]}
                        queryFn={({signal}) => {
                            const params = new URLSearchParams();
                            if (selectedRegionId !== null) params.set("idRegion", String(selectedRegionId));
                            if (selectedDependenciaId !== null) params.set("idDependencia", String(selectedDependenciaId));
                            const query = params.size > 0 ? `?${params}` : "";
                            return apiFetch(`/api/v1/matriculaformal/graficas/movilidad-por-nivel-educativo${query}`, {signal})
                                .then((r) => r.json())
                                .then((raw) => mapPieDataField(raw, "groupBy"));
                        }}
                        selectedRegion={isRegionSelected ? region : undefined}
                        selectedDependencia={isDependenciaSelected ? dependencia : undefined}
                        colorTheme={"barman"}
                        allowedModesDefault={["data", "graph"]}
                        allowedModesRegion={["data"]}
                        allowedModesDependencia={["data"]}
                    />
                </div>

                {/*<div className="w-full lg:w-1/2 xl:w-1/2 p-2 min-w-0">*/}
                {/*    <CustomChart*/}
                {/*        queryKey={["dashboard", "personal2", region]}*/}
                {/*        queryFn={({signal}) =>*/}
                {/*            apiFetch("/api/v1/entidadesdependencias/personal", {signal}).then((r) => r.json())*/}
                {/*        }*/}
                {/*        colors={["#C8796F"]}*/}
                {/*        orientation="vertical"*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
