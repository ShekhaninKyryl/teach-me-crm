import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';

type RatingProps = {
  rating: number;
  color?: string;
  size?: number;
  showPercentage?: boolean;
};

export const Rating = ({ rating, color = 'accent', size = 20, showPercentage }: RatingProps) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;
    const fillPercent = rating >= starValue ? 100 : rating > i ? (rating - i) * 100 : 0;

    return (
      <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
        <FontAwesomeIcon
          icon={solidStar}
          className={`text-${color} opacity-40`}
          style={{ width: size, height: size }}
        />
        <span
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${fillPercent}%`, height: size }}
        >
          <FontAwesomeIcon
            icon={solidStar}
            className={`text-${color}`}
            style={{ width: size, height: size }}
          />
        </span>
      </span>
    );
  });

  return (
    <div className="flex items-center">
      <span className="flex">{stars}</span>
      <span className="ml-2 font-bold text-text text-lg">{rating.toFixed(1)}</span>
      {showPercentage && <span className="ml-1 text-secondary">({(rating * 20).toFixed(0)}%)</span>}
    </div>
  );
};
