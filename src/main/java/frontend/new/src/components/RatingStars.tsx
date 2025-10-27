import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showNumber?: boolean;
}

export function RatingStars({ rating, maxRating = 5, size = 20, showNumber = true }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const fillPercentage = Math.min(Math.max(rating - index, 0), 1);
        
        return (
          <div key={index} className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="absolute text-gray-300"
              fill="currentColor"
            />
            <div
              className="absolute overflow-hidden"
              style={{ width: `${fillPercentage * 100}%` }}
            >
              <Star
                size={size}
                className="text-yellow-400"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
      {showNumber && (
        <span className="ml-1 text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
