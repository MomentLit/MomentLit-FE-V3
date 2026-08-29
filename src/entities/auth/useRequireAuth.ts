import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store";

/**
 * Gates a page behind login: opens the shared auth modal when the page
 * mounts without an authenticated session, and sends the user back to "/"
 * if they dismiss that modal without logging in.
 */
export function useRequireAuth() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthModalOpen = useAuthStore((state) => state.isAuthModalOpen);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const wasModalOpenRef = useRef(false);

  useEffect(() => {
    if (!isHydrated || isAuthenticated) return;

    openAuthModal();
  }, [isHydrated, isAuthenticated, openAuthModal]);

  useEffect(() => {
    if (isAuthModalOpen) {
      wasModalOpenRef.current = true;
      return;
    }

    if (wasModalOpenRef.current && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthModalOpen, isAuthenticated, router]);
}
