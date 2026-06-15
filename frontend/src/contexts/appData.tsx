import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/auth";
import type { Dependencia, Region } from "@/types/api";

type AppDataStatus = "idle" | "loading" | "ready" | "error";

type AppDataContextType = {
  status: AppDataStatus;
  regiones: Region[];
  dependencias: Dependencia[];
  retry: () => void;
};

const AppDataContext = createContext<AppDataContextType>(null!);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<AppDataStatus>("idle");
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [dependencias, setDependencias] = useState<Dependencia[]>([]);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setStatus("idle");
      setRegiones([]);
      setDependencias([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const [regionesRes, dependenciasRes] = await Promise.all([
          apiFetch("/api/v1/regiones"),
          apiFetch("/api/v1/dependencias"),
          // añadir la tercera consulta aquí
        ]);

        if (cancelled) return;
        if (!regionesRes.ok || !dependenciasRes.ok) throw new Error();

        const [regionesData, dependenciasData]: [Region[], Dependencia[]] = await Promise.all([
          regionesRes.json(),
          dependenciasRes.json(),
        ]);
        if (cancelled) return;

        setRegiones(regionesData);
        setDependencias(dependenciasData);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, authLoading, loadKey]);

  function retry() {
    setLoadKey((k) => k + 1);
  }

  return (
    <AppDataContext.Provider value={{ status, regiones, dependencias, retry }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
