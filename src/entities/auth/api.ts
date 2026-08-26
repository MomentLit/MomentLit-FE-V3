import { apiClient } from "@/shared/api";

function getRefreshToken() {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem("refresh_token") ??
    window.localStorage.getItem("momentlit_refresh_token")
  );
}

function clearStoredTokens() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem("momentlit_access_token");
  window.localStorage.removeItem("momentlit_refresh_token");
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
