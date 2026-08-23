"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryProps {
  imageCount: number;
}

export function Gallery({ imageCount }: GalleryProps) {
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => (i - 1 + imageCount) % imageCount);
  const goNext = () => setIndex((i) => (i + 1) % imageCount);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative flex h-[480px] w-full items-center justify-between rounded-2xl bg-gray-100 px-4">
        <button
          type="button"
          aria-label="이전 이미지"
          onClick={goPrev}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-[0px_2px_8px_0px_rgba(33,41,48,0.15)]"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">
          {index + 1} / {imageCount}
        </span>
        <button
          type="button"
          aria-label="다음 이미지"
          onClick={goNext}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-[0px_2px_8px_0px_rgba(33,41,48,0.15)]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: imageCount }, (_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-5 bg-primary-500" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-2.5">
        {Array.from({ length: imageCount }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}번째 이미지 보기`}
            onClick={() => setIndex(i)}
            className={`h-[84px] flex-1 rounded-lg bg-gray-100 ${
              i === index ? "border-2 border-primary-500" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
