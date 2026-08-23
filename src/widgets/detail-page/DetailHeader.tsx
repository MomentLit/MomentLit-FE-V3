"use client";

import { Bookmark } from "lucide-react";

interface DetailHeaderProps {
  categoryLabel: string;
  title: string;
  address: string;
  walkTime: string;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

export function DetailHeader({
  categoryLabel,
  title,
  address,
  walkTime,
  bookmarked,
  onToggleBookmark,
}: DetailHeaderProps) {
  return (
    <div className="flex w-full items-start justify-between gap-4">
      <div className="flex flex-1 flex-col gap-2">
        <span className="inline-flex w-fit rounded-full bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-600">
          {categoryLabel}
        </span>
        <h1 className="text-[40px] leading-[58px] font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-[15px] text-gray-600">
          {address} · {walkTime}
        </p>
      </div>
      <button
        type="button"
        aria-pressed={bookmarked}
        onClick={onToggleBookmark}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900"
      >
        <Bookmark
          size={16}
          className={bookmarked ? "fill-red-500 text-red-500" : ""}
        />
        저장
      </button>
    </div>
  );
}
