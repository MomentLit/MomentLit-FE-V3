"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryProps {
  images: string[];
  onImageClick?: (index: number) => void;
}

export function Gallery({ images, onImageClick }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const imageCount = images.length;
  const selectedImage = images[index];

  const goPrev = () => {
    if (imageCount === 0) return;
    setIndex((i) => (i - 1 + imageCount) % imageCount);
  };
  const goNext = () => {
    if (imageCount === 0) return;
    setIndex((i) => (i + 1) % imageCount);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className={`relative flex h-[480px] w-full items-center justify-between overflow-hidden rounded-2xl bg-gray-100 bg-cover bg-center px-4 ${
          selectedImage && onImageClick ? "cursor-zoom-in" : ""
        }`}
        style={
          selectedImage ? { backgroundImage: `url(${selectedImage})` } : undefined
        }
        onClick={() => {
          if (selectedImage) onImageClick?.(index);
        }}
      >
        {!selectedImage && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-500">
            등록된 이미지가 없습니다.
          </span>
        )}
        <button
          type="button"
          aria-label="이전 이미지"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          disabled={imageCount <= 1}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-[0px_2px_8px_0px_rgba(33,41,48,0.15)]"
        >
          <ChevronLeft size={20} />
        </button>
        {imageCount > 0 && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">
            {index + 1} / {imageCount}
          </span>
        )}
        <button
          type="button"
          aria-label="다음 이미지"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          disabled={imageCount <= 1}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-[0px_2px_8px_0px_rgba(33,41,48,0.15)]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {images.map((image, i) => (
          <span
            key={`${image}-${i}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-5 bg-primary-500" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-2.5">
        {images.map((image, i) => (
          <button
            key={`${image}-${i}`}
            type="button"
            aria-label={`${i + 1}번째 이미지 보기`}
            onClick={() => setIndex(i)}
            className={`h-[84px] flex-1 rounded-lg bg-gray-100 bg-cover bg-center ${
              i === index ? "border-2 border-primary-500" : ""
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
    </div>
  );
}
