import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

type AuthContextType = {
  isAuthenticated: boolean;
  username: string | null;
  roles: string[];
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const wasAuthenticatedRef = useRef(false);

  useEffect(() => {
    wasAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    function handleUnauthorized() {
      if (!wasAuthenticatedRef.current) return;
      toast.error("Tu sesión ha expirado. Por favor inicia sesión nuevamente.", {
        id: "auth-expired",
      });
      setIsAuthenticated(false);
      setUsername(null);
      setRoles([]);
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    apiFetch("/api/v1/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setIsAuthenticated(true);
        setUsername(data.username);
        setRoles(data.roles ?? []);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUsername(null);
        setRoles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username: string, password: string) {
    const res = await apiFetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Credenciales no válidas");
    const data = await res.json();
    setIsAuthenticated(true);
    setUsername(data.username);
    setRoles(data.roles ?? []);
  }

  async function logout() {
    await apiFetch("/api/v1/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    setUsername(null);
    setRoles([]);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, roles, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
