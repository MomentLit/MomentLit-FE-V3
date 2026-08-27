import { create } from "zustand";
import {
  hasStoredSession,
  signIn as signInRequest,
  signUp as signUpRequest,
  signOut as signOutRequest,
  type SignInPayload,
  type SignUpPayload,
} from "./api";

interface AuthState {
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrate: () => void;
  login: (payload: SignInPayload) => Promise<void>;
  register: (payload: SignUpPayload) => Promise<void>;
  logout: () => Promise<void>;
}

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
  register: async (payload) => {
    await signUpRequest(payload);
    set({ isAuthenticated: true });
  },
  logout: async () => {
    await signOutRequest();
    set({ isAuthenticated: false });
  },
}));
