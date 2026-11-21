import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// For public routes (no token needed)
export const publicApi = axios.create({ baseURL });

// For protected routes: a JWT is attached to every request
export const api = axios.create({ baseURL });

let cached: { token: string; expiresAt: number } | null = null;

export function resetToken() {
  cached = null;
}

async function getToken(force = false): Promise<string | null> {
  if (!force && cached && cached.expiresAt - Date.now() > 60_000) {
    return cached.token;
  }

  try {
    const response = await fetch("/api/token", { cache: "no-store" });
    if (!response.ok) {
      cached = null;
      return null;
    }

    const { token } = (await response.json()) as { token: string | null };
    if (!token) return null;

    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp: number };

    cached = { token, expiresAt: payload.exp * 1000 };
    return token;
  } catch {
    return null;
  }
}

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server says 401, fetch a fresh token and try once more
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      const token = await getToken(true);
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);
