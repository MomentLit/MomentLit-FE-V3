import { create } from "zustand";
import {
  hasStoredSession,
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
  hydrate: () => void;
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
  hydrate: () => {
    set({ isAuthenticated: hasStoredSession(), isHydrated: true });
  },
  login: async (payload) => {
    await signInRequest(payload);
    set({ isAuthenticated: true });
  },
  completeOAuthLogin: async (payload) => {
    const requestKey = `${payload.provider}:${payload.code}`;
    const existingRequest = oauthLoginRequests.get(requestKey);

    if (existingRequest) {
      return existingRequest;
    }

    const request = completeOAuthLogin(payload)
      .then(() => {
        set({ isAuthenticated: true });
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
