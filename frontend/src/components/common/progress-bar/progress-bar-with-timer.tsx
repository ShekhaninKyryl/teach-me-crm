import { useTimerPercentage } from 'hooks/useTimerPercentage';
import { ProgressBar } from 'components/common/progress-bar/progress-bar';

type ProgressBarWithTimerProps = {
  timer: number;
  color: string;
  strokeWidth?: number;
  showPercentage?: boolean;
  reverse?: boolean;
};

export const ProgressBarWithTimer = ({
  timer,
  reverse = false,
  ...props
}: ProgressBarWithTimerProps) => {
  const timerPercentage = useTimerPercentage(timer);
  const percentage = reverse ? timerPercentage : 100 - timerPercentage;

  return <ProgressBar {...props} percentage={percentage} />;
};
