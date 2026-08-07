"use client";

import { Bookmark } from "lucide-react";
import type { Space } from "../model";

interface PopupHighlightCardProps {
  space: Space;
  onToggleBookmark?: (id: string) => void;
}

export function PopupHighlightCard({
  space,
  onToggleBookmark,
}: PopupHighlightCardProps) {
  return (
    <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100">
      <button
        type="button"
        aria-label={space.bookmarked ? "관심 공간 해제" : "관심 공간 등록"}
        onClick={() => onToggleBookmark?.(space.id)}
        className="absolute top-4 right-4 z-10"
      >
        <Bookmark
          size={24}
          className={
            space.bookmarked
              ? "fill-red-500 text-red-500"
              : "text-gray-900"
          }
        />
      </button>

      <div className="absolute inset-0 flex flex-col items-start justify-end gap-0 bg-gradient-to-b from-black/0 to-black/60 p-4 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
        <p className="w-full text-[20px] leading-[28px] font-semibold text-white">
          {space.name}
        </p>
        <p className="w-full text-[15px] leading-[22px] text-white">
          {space.address}
        </p>
      </div>
    </div>
  );
}
