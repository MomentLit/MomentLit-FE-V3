"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMyProfile } from "@/entities/user";
import { LogoutModal } from "./LogoutModal";

const MENU_ITEMS = [
  { href: "/mypage/profile", label: "정보수정" },
  { href: "/mypage/spaces", label: "나의 공간 및 팝업" },
  { href: "/mypage/matches", label: "나의 매칭" },
  { href: "/mypage/approvals", label: "팝업 승인 및 거부" },
] as const;

export function MyPagePanel() {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const profileQuery = useQuery({
    queryKey: ["users", "me"],
    queryFn: getMyProfile,
  });
  const profile = profileQuery.data;

  return (
    <>
      <aside className="sticky top-0 flex h-screen w-[360px] shrink-0 flex-col border-r border-gray-200 px-10 py-9">
        <p className="text-[28px] font-semibold text-gray-900">마이페이지</p>

        <div className="flex items-center gap-4 py-7">
          <div className="size-14 shrink-0 rounded-full bg-gray-300" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-xl font-semibold text-gray-900">
              {profile?.name ?? "사용자"}
            </p>
            <p className="text-sm text-gray-600">{profile?.role ?? "게스트"}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 pt-2">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-4 py-3.5 text-base ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-900"
                }`}
              >
                <span className="flex-1">{item.label}</span>
                <span className="text-gray-600">›</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-2 rounded-lg px-4 py-3.5 text-left text-base text-gray-900"
          >
            <span className="flex-1">로그 아웃</span>
            <span className="text-gray-600">›</span>
          </button>
        </nav>
      </aside>

      {isLogoutModalOpen && (
        <LogoutModal onClose={() => setIsLogoutModalOpen(false)} />
      )}
    </>
  );
}
