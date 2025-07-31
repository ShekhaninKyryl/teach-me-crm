export type ProgressBarProps = {
  percentage: number;
  color: string;
  strokeWidth?: number;
  showPercentage?: boolean;
};

export const ProgressBar = ({
  percentage,
  color,
  strokeWidth = 10,
  showPercentage = false,
}: ProgressBarProps) => {
  return (
    <div className="relative inline-block w-full" style={{ height: strokeWidth }}>
      <svg className="block w-full" height={strokeWidth}>
        <line
          x1={0}
          y1={strokeWidth / 2}
          x2="100%"
          y2={strokeWidth / 2}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="text-background-secondary"
        />

        {/* Лінія прогресу */}
        {percentage > 0 && (
          <line
            x1={0}
            y1={strokeWidth / 2}
            x2={`${percentage}%`}
            y2={strokeWidth / 2}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className={`text-${color} transition-all border-none`}
            strokeLinecap="round"
          />
        )}
      </svg>

      {showPercentage && (
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
          {percentage}%
        </span>
      )}
    </div>
  );
};
