import { apiClient, publicApiClient, type ApiResponse } from "@/shared/api";

export interface AuthSession {
  name: string;
  role: string;
  access_token: string;
  refresh_token: string;
  expires_in: string | number;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface SignUpResponse {
  user_id: string;
}

export type OAuthProvider = "google" | "naver" | "kakao";

function getRefreshToken() {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem("refresh_token") ??
    window.localStorage.getItem("momentlit_refresh_token")
  );
}

function storeTokens(tokens: Pick<AuthSession, "access_token" | "refresh_token">) {
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

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
}

export function getCurrentUserId() {
  if (typeof window === "undefined") return null;

  const token =
    window.localStorage.getItem("access_token") ??
    window.localStorage.getItem("momentlit_access_token");

  if (!token || token === "null" || token === "undefined") return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const claims = JSON.parse(base64UrlDecode(payload)) as {
      sub?: string;
      user_id?: string;
      id?: string;
    };

    return claims.sub ?? claims.user_id ?? claims.id ?? null;
  } catch {
    return null;
  }
}

export async function signIn(payload: SignInPayload) {
  const response = await publicApiClient.post<ApiResponse<AuthSession>>(
    "/auth/signin",
    payload,
  );
  storeTokens(response.data.data);
}

export async function signUp(payload: SignUpPayload) {
  const response = await publicApiClient.post<ApiResponse<SignUpResponse>>(
    "/users/signup",
    payload,
  );

  return response.data.data;
}

export async function completeOAuthLogin(params: {
  provider: OAuthProvider;
  code: string;
  state?: string;
}) {
  const response = await publicApiClient.get<ApiResponse<AuthSession>>(
    `/auth/oauth/${params.provider}/callback`,
    {
      params: {
        code: params.code,
        state: params.state,
      },
    },
  );

  storeTokens(response.data.data);

  return response.data.data;
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
