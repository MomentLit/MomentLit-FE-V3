import { StarRating } from "./StarRating";
import type { Review } from "../model";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex h-40 items-start justify-between gap-4 rounded-2xl border border-gray-300 p-5">
      <div className="flex flex-col gap-2">
        <StarRating rating={review.rating} />
        <div className="flex items-baseline gap-2">
          <p className="text-[15px] text-gray-900">{review.author}</p>
          <p className="text-xs text-gray-400">{review.date}</p>
        </div>
        <p className="text-base text-gray-900">{review.comment}</p>
      </div>
      <div className="h-full w-24 shrink-0 rounded-xl bg-gray-100" />
    </div>
  );
}
