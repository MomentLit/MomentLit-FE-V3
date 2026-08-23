"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ReviewCard, type Review } from "@/entities/review";

type ReviewFilter = "LATEST" | 1 | 2 | 3 | 4 | 5;

const FILTERS: { value: ReviewFilter; label: string }[] = [
  { value: "LATEST", label: "최신순" },
  { value: 5, label: "5점" },
  { value: 4, label: "4점" },
  { value: 3, label: "3점" },
  { value: 2, label: "2점" },
  { value: 1, label: "1점" },
];

function filterTagClass(isSelected: boolean) {
  return `shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
    isSelected
      ? "bg-primary-500 text-white"
      : "bg-gray-100 text-gray-900 hover:bg-[#e4e9f0]"
  }`;
}

interface ReviewModalProps {
  reviews: Review[];
  onClose: () => void;
}

export function ReviewModal({ reviews, onClose }: ReviewModalProps) {
  const [filter, setFilter] = useState<ReviewFilter>("LATEST");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const filteredReviews =
    filter === "LATEST" ? reviews : reviews.filter((r) => r.rating === filter);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-4xl flex-col gap-6 overflow-y-auto rounded-2xl bg-white p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-5xl font-bold text-gray-900">후기</h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 border-b border-gray-200 pb-6">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={filterTagClass(filter === item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
