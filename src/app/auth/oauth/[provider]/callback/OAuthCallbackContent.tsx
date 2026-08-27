"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type OAuthProvider } from "@/entities/auth";
import { getApiErrorMessage } from "@/shared/api";

const OAUTH_PROVIDERS: OAuthProvider[] = ["google", "naver", "kakao"];

interface OAuthCallbackContentProps {
  provider: string;
  code: string | null;
  state?: string;
}

export function OAuthCallbackContent({
  provider,
  code,
  state,
}: OAuthCallbackContentProps) {
  const router = useRouter();
  const completeOAuthLogin = useAuthStore((store) => store.completeOAuthLogin);
  const [error, setError] = useState<string | null>(null);

  const isInvalidCallback =
    !OAUTH_PROVIDERS.includes(provider as OAuthProvider) || !code;
  const displayMessage =
    error ??
    (isInvalidCallback
      ? "OAuth 로그인 정보를 확인할 수 없습니다."
      : "로그인을 완료하는 중입니다.");

  useEffect(() => {
    if (isInvalidCallback || !code) return;

    completeOAuthLogin({
      provider: provider as OAuthProvider,
      code,
      state,
    })
      .then(() => {
        router.replace("/");
      })
      .catch((error) => {
        setError(getApiErrorMessage(error, "OAuth 로그인에 실패했습니다."));
      });
  }, [code, completeOAuthLogin, isInvalidCallback, provider, router, state]);

  return (
    <div className="flex min-h-screen items-center justify-center p-10">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-8 shadow-[4px_4px_4px_0px_rgba(204,204,204,0.25)]">
        <h1 className="text-2xl font-semibold text-gray-900">
          OAuth 로그인
        </h1>
        <p className="text-center text-sm text-gray-600">{displayMessage}</p>
      </div>
    </div>
  );
}
