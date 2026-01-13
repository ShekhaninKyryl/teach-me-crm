import { getTime } from 'components/availability-table/functions';

type TimeSlotProps = {
  index: number;
  day: string;
  stepMinute: number;
  selected: boolean;
  disabled?: boolean;
  label?: string;
  onClick: (day: string, time: string) => void;
};

export const TimeSlot = ({
  index,
  day,
  stepMinute,
  selected,
  label,
  disabled,
  onClick,
}: TimeSlotProps) => {
  const timeLabel = getTime(index, stepMinute);

  const classNames = [
    'h-5 text-center text-xs',
    selected ? 'text-secondary bg-chart-2' : 'border-b border-l',
    !disabled && (selected ? 'hover:opacity-90' : 'hover:cursor-pointer hover:bg-secondary'),
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={() => onClick(day, timeLabel)}>
      {label}
    </div>
  );
};
