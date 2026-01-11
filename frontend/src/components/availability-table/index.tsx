import { useState, type FC } from 'react';
import { _ } from '@/translates';
import {
  changeAvailability,
  changeDayAvailability,
  getTime,
  getTimeLabel,
  isSelected,
} from 'components/availability-table/functions';
import { TimeSlot } from 'components/availability-table/time-slot';
import { DAY_OF_WEEK } from 'constants/days-of-week';
import { debounce } from 'utils/throttle-debounce';
import type { AvailabilityList } from './types';

type AvailabilityTableProps = {
  step: '1h' | '30m';
  value: AvailabilityList;
  onChange: (availability: AvailabilityList) => void;
};

const AvailabilityTable: FC<AvailabilityTableProps> = ({
  step = '1h',
  value = ['Mon 19:00-21:00'],
  onChange,
}) => {
  const [localValue, setLocalValue] = useState<AvailabilityList>(value);
  const stepMinute = step === '1h' ? 60 : 30;

  const handleValueChange = (newValue: AvailabilityList) => {
    setLocalValue(newValue);
    debounce(() => onChange(newValue), 300)();
  };

  const onSlotClick = (day: string, time: string) => {
    const newAvailability = changeAvailability(day, time, localValue, stepMinute);
    handleValueChange(newAvailability);
  };

  const onDayHeaderClick = (day: string) => {
    const newAvailability = changeDayAvailability(day, localValue, stepMinute);

    handleValueChange(newAvailability);
  };

  const getTimeColumn = () => {
    const slots = 1440 / stepMinute;
    return (
      <div>
        <div className="h-8 border-b bg-surface" />
        {Array.from({ length: slots }).map((_, i) => {
          const time = getTime(i, stepMinute);
          return (
            <div key={time} className="h-5 border-b bg-surface relative">
              <div className="text-xs absolute right-1">{time}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const getDayColumn = (day: string) => {
    const slots = 1440 / stepMinute;

    return (
      <div className="border-l">
        <div
          className="h-8 text-center font-semibold border-b bg-surface py-2 hover:cursor-pointer hover:bg-secondary"
          onClick={() => onDayHeaderClick(day)}
        >
          {_(day)}
        </div>
        {Array.from({ length: slots }).map((_, i) => {
          const time = getTime(i, stepMinute);
          const selected = isSelected(day, time, localValue);

          return (
            <TimeSlot
              index={i}
              day={day}
              stepMinute={stepMinute}
              selected={selected}
              label={getTimeLabel(day, time, localValue)}
              onClick={onSlotClick}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="border rounded-lg overflow-hidden min-w-xl grid grid-cols-8">
        {getTimeColumn()}
        {DAY_OF_WEEK['en'].map((day) => getDayColumn(day))}
      </div>
    </div>
  );
};

export default AvailabilityTable;
