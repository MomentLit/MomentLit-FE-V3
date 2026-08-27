"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[400px] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-8 shadow-[0px_8px_24px_0px_rgba(53,65,80,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        {mode === "SIGN_IN" ? (
          <SignInForm
            onSuccess={onClose}
            onSwitchToSignUp={() => setMode("SIGN_UP")}
          />
        ) : (
          <SignUpForm
            onSuccess={() => setMode("SIGN_IN")}
            onSwitchToSignIn={() => setMode("SIGN_IN")}
          />
        )}
      </div>
    </div>,
    document.body,
  );
}
