import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/auth";

export type Region = { id: number; name: string };

type AppDataStatus = "idle" | "loading" | "ready" | "error";

type AppDataContextType = {
  status: AppDataStatus;
  regiones: Region[];
  retry: () => void;
};

const AppDataContext = createContext<AppDataContextType>(null!);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<AppDataStatus>("idle");
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setStatus("idle");
      setRegiones([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const [regionesRes] = await Promise.all([
          apiFetch("/api/v1/regiones"),
          // añadir las otras dos consultas aquí
        ]);

        if (cancelled) return;
        if (!regionesRes.ok) throw new Error();

        const regionesData: Region[] = await regionesRes.json();
        if (cancelled) return;

        setRegiones(regionesData);
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
    <AppDataContext.Provider value={{ status, regiones, retry }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
