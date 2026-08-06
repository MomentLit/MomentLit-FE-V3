"use client";

import Image from "next/image";
import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  Bookmark,
  Inbox,
  ChevronsUpDown,
} from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";

const iconProps = { size: 18, className: "shrink-0 text-gray-900" };

const NAV_SECTIONS = [
  {
    title: "탐색",
    items: [
      { href: "/", label: "홈", icon: <Home {...iconProps} /> },
      { href: "/search", label: "통합 검색", icon: <Search {...iconProps} /> },
    ],
  },
  {
    title: "예약 · 소통",
    items: [
      { href: "/reservations", label: "예약", icon: <Calendar {...iconProps} /> },
      { href: "/messages", label: "메세지", icon: <MessageSquare {...iconProps} /> },
    ],
  },
  {
    title: "내 활동",
    items: [{ href: "/favorites", label: "관심 공간", icon: <Bookmark {...iconProps} /> }],
  },
  {
    title: "고객센터",
    items: [{ href: "/support", label: "건의함", icon: <Inbox {...iconProps} /> }],
  },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[298px] shrink-0 flex-col justify-between bg-white px-5 pt-10 pb-[30px] shadow-[4px_4px_4px_0px_rgba(204,204,204,0.25)]">
      <div className="flex flex-col gap-4">
        <Image
          src="/images/SideBarLogo.svg"
          alt="모먼트릿"
          width={144}
          height={28}
        />

        <nav className="flex flex-col gap-[10px]">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-900">
                {section.title}
              </p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <SidebarNavItem key={item.href} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-12 shrink-0 rounded-full bg-gray-300" />
          <p className="text-base text-black">권길현</p>
        </div>
        <ChevronsUpDown size={18} className="shrink-0 text-gray-900" />
      </div>
    </aside>
  );
}
