"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function RegisterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-full bg-primary-500 px-5 py-2.5 text-base font-medium whitespace-nowrap text-white"
      >
        + 새로 등록
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0px_8px_24px_0px_rgba(33,41,48,0.12)]">
          <Link
            href="/spaces/new"
            className="block rounded-lg px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            + 공간 등록
          </Link>
          <Link
            href="/popups/new"
            className="block rounded-lg px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            + 팝업 등록
          </Link>
        </div>
      )}
    </div>
  );
}
