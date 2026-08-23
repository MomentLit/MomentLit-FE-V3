"use client";

import { ReviewCard, type Review } from "@/entities/review";

interface ReviewSectionProps {
  reviews: Review[];
  onOpenAll: () => void;
}

export function ReviewSection({ reviews, onOpenAll }: ReviewSectionProps) {
  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[32px] font-bold text-gray-900">후기</h2>
        <button
          type="button"
          onClick={onOpenAll}
          className="text-[15px] text-gray-600"
        >
          자세히 보기 ›
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {reviews.slice(0, 2).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
