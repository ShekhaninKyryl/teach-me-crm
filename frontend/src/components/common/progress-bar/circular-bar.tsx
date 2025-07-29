export type CircularBarProps = {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
};

export const CircularBar = ({
  percentage,
  color,
  size = 100,
  strokeWidth = 10,
  showPercentage = false,
}: CircularBarProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`inline-block`} style={{ width: size, height: size }}>
      <svg className="block" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className={`text-${color} transition-all duration-300`}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showPercentage && (
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
          {percentage}%
        </span>
      )}
    </div>
  );
};
