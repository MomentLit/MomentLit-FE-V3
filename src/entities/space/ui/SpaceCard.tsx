"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import type { Space } from "../model";

interface SpaceCardProps {
  space: Space;
  onToggleBookmark?: (id: string) => void;
}

export function SpaceCard({ space, onToggleBookmark }: SpaceCardProps) {
  return (
    <Link href={`/spaces/${space.id}`} className="flex w-full flex-col gap-1">
      <div className="relative flex aspect-[3/2] w-full items-start justify-end overflow-hidden rounded-xl bg-gray-100 p-4">
        <button
          type="button"
          aria-label={space.bookmarked ? "관심 공간 해제" : "관심 공간 등록"}
          onClick={(event) => {
            event.preventDefault();
            onToggleBookmark?.(space.id);
          }}
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
      </div>
      <div className="flex flex-col">
        <p className="truncate text-[18px] leading-[26px] font-medium text-gray-900">
          {space.name}
        </p>
        <p className="text-[15px] leading-[22px] text-gray-600">
          {space.address}
        </p>
      </div>
    </Link>
  );
}
