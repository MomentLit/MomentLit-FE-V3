import axios, { type InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const token =
    window.localStorage.getItem("access_token") ??
    window.localStorage.getItem("momentlit_access_token");

  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

// Returns true if the session was recovered (e.g. via a token refresh) and
// the original request is safe to retry; false if the user is truly logged out.
type AuthFailureHandler = () => Promise<boolean>;

let authFailureHandler: AuthFailureHandler | null = null;

export function setAuthFailureHandler(handler: AuthFailureHandler) {
  authFailureHandler = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const status = error.response?.status;
    const config = error.config as RetriableRequestConfig | undefined;

    if ((status === 401 || status === 403) && config && !config._retried && authFailureHandler) {
      config._retried = true;

      const recovered = await authFailureHandler();
      if (recovered) {
        return apiClient(config);
      }
    }

    return Promise.reject(error);
  },
);
