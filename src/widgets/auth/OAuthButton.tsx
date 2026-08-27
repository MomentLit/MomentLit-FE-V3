import Image from "next/image";

type OAuthProvider = "google" | "naver" | "kakao";

const PROVIDER_STYLES: Record<OAuthProvider, string> = {
  google: "bg-gray-100 text-gray-900",
  naver: "bg-[#06be34] text-white",
  kakao: "bg-[#fae100] text-gray-900",
};

const PROVIDER_ICON: Record<OAuthProvider, string> = {
  google: "/images/oauth/google.svg",
  naver: "/images/oauth/naver.svg",
  kakao: "/images/oauth/kakao.png",
};

interface OAuthButtonProps {
  provider: OAuthProvider;
  label: string;
}

export function OAuthButton({ provider, label }: OAuthButtonProps) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const href = baseURL ? `${baseURL}/auth/oauth/${provider}` : "#";

  return (
    <a
      href={href}
      className={`flex w-full items-center justify-center gap-3 rounded-xl py-3 text-sm font-semibold ${PROVIDER_STYLES[provider]}`}
    >
      <Image src={PROVIDER_ICON[provider]} alt="" width={18} height={18} />
      {label}
    </a>
  );
}
