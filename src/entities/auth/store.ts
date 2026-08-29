import { create } from "zustand";
import { setAuthFailureHandler } from "@/shared/api";
import {
  clearStoredTokens,
  hasStoredSession,
  isAccessTokenExpired,
  refreshAccessToken,
  completeOAuthLogin,
  signIn as signInRequest,
  signUp as signUpRequest,
  signOut as signOutRequest,
  type OAuthProvider,
  type SignInPayload,
  type SignUpPayload,
} from "./api";

interface AuthState {
  isAuthenticated: boolean;
  isHydrated: boolean;
  isAuthModalOpen: boolean;
  hydrate: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  handleUnauthorized: () => void;
  login: (payload: SignInPayload) => Promise<void>;
  completeOAuthLogin: (payload: {
    provider: OAuthProvider;
    code: string;
    state?: string;
  }) => Promise<void>;
  register: (payload: SignUpPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const oauthLoginRequests = new Map<string, Promise<void>>();

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isHydrated: false,
  isAuthModalOpen: false,
  hydrate: async () => {
    if (!hasStoredSession()) {
      set({ isAuthenticated: false, isHydrated: true });
      return;
    }

    if (isAccessTokenExpired()) {
      try {
        await refreshAccessToken();
        set({ isAuthenticated: true, isHydrated: true });
      } catch {
        clearStoredTokens();
        set({ isAuthenticated: false, isHydrated: true });
      }
      return;
    }

    set({ isAuthenticated: true, isHydrated: true });
  },
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  handleUnauthorized: () => {
    clearStoredTokens();
    set({ isAuthenticated: false, isAuthModalOpen: true });
  },
  login: async (payload) => {
    await signInRequest(payload);
    set({ isAuthenticated: true, isAuthModalOpen: false });
  },
  completeOAuthLogin: async (payload) => {
    const requestKey = `${payload.provider}:${payload.code}`;
    const existingRequest = oauthLoginRequests.get(requestKey);

    if (existingRequest) {
      return existingRequest;
    }

    const request = completeOAuthLogin(payload)
      .then(() => {
        set({ isAuthenticated: true, isAuthModalOpen: false });
      })
      .finally(() => {
        oauthLoginRequests.delete(requestKey);
      });

    oauthLoginRequests.set(requestKey, request);

    return request;
  },
  register: async (payload) => {
    await signUpRequest(payload);
  },
  logout: async () => {
    await signOutRequest();
    set({ isAuthenticated: false });
  },
}));

setAuthFailureHandler(async () => {
  // Only attempt recovery when the local access token is actually
  // missing/expired — a 401/403 while it's still valid is a genuine
  // per-resource permission error, not a lost session.
  if (!isAccessTokenExpired()) return false;

  try {
    await refreshAccessToken();
    useAuthStore.setState({ isAuthenticated: true });
    return true;
  } catch {
    useAuthStore.getState().handleUnauthorized();
    return false;
  }
});
