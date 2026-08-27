import { apiClient, type ApiResponse } from "@/shared/api";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  nickname: string;
  phone: string;
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem("refresh_token") ??
    window.localStorage.getItem("momentlit_refresh_token")
  );
}

function storeTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem("access_token", tokens.access_token);
  window.localStorage.setItem("refresh_token", tokens.refresh_token);
}

function clearStoredTokens() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem("momentlit_access_token");
  window.localStorage.removeItem("momentlit_refresh_token");
}

export function hasStoredSession() {
  if (typeof window === "undefined") return false;

  const token =
    window.localStorage.getItem("access_token") ??
    window.localStorage.getItem("momentlit_access_token");

  return Boolean(token && token !== "null" && token !== "undefined");
}

export async function signIn(payload: SignInPayload) {
  const response = await apiClient.post<ApiResponse<AuthTokens>>(
    "/auth/signin",
    payload,
  );
  storeTokens(response.data.data);
}

export async function signUp(payload: SignUpPayload) {
  const response = await apiClient.post<ApiResponse<AuthTokens>>(
    "/auth/signup",
    payload,
  );
  storeTokens(response.data.data);
}

export async function signOut() {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken && refreshToken !== "null" && refreshToken !== "undefined") {
      await apiClient.post("/auth/signout", {
        refresh_token: refreshToken,
      });
    }
  } finally {
    clearStoredTokens();
  }
}
