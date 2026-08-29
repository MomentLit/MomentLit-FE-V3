"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth/store";
import { AuthModal } from "@/widgets/auth";

function AuthHydrator() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const isAuthModalOpen = useAuthStore((state) => state.isAuthModalOpen);
  const closeAuthModal = useAuthStore((state) => state.closeAuthModal);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator />
      {children}
      {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
    </QueryClientProvider>
  );
}
