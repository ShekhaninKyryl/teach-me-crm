import { getTime } from 'components/availability-table/functions';

type TimeSlotProps = {
  index: number;
  day: string;
  stepMinute: number;
  selected: boolean;
  label?: string;
  onClick: (day: string, time: string) => void;
};

export const TimeSlot = ({ index, day, stepMinute, selected, label, onClick }: TimeSlotProps) => {
  const timeLabel = getTime(index, stepMinute);

  const classNames = [
    'h-5 text-center text-xs hover:cursor-pointer',
    selected
      ? 'text-secondary bg-chart-2 hover:opacity-90'
      : 'hover:bg-secondary border-b border-l',
  ].join(' ');

  return (
    <div className={classNames} onClick={() => onClick(day, timeLabel)}>
      {label}
    </div>
  );
};
