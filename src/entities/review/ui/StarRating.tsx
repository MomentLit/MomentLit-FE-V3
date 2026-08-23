import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          className={
            index < rating
              ? "fill-yellow-500 text-yellow-500"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}
