import { CircularBar } from 'components/common/progress-bar/circular-bar';
import { useTimerPercentage } from 'hooks/useTimerPercentage';

type CircularBarWithTimerProps = {
  timer: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  reverse?: boolean;
};

export const CircularBarWithTimer = ({
  timer,
  reverse = false,
  ...props
}: CircularBarWithTimerProps) => {
  const timerPercentage = useTimerPercentage(timer);
  const percentage = reverse ? timerPercentage : 100 - timerPercentage;
  return <CircularBar {...props} percentage={percentage} />;
};
