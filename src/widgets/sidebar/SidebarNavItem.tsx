"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: ReactNode;
}

export function SidebarNavItem({ href, label, icon }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex w-[258px] items-center gap-2 rounded-lg p-3 transition-colors ${
        isActive ? "bg-gray-100" : "hover:bg-gray-100"
      }`}
    >
      {icon}
      <span
        className={`whitespace-nowrap text-base ${
          isActive ? "font-medium text-black" : "font-medium text-gray-900"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
