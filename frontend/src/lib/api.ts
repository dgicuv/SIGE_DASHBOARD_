const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, { credentials: "include", ...init }).then((res) => {
    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return res;
  });
}
