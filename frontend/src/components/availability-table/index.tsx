import { useState, type FC } from 'react';
import { _ } from '@/translates';
import type { AvailabilityList } from './types';
import {
  changeAvailability,
  changeDayAvailability,
  getTime,
  getTimeLabel,
  isSelected,
} from 'components/availability-table/functions';
import { TimeSlot } from 'components/availability-table/time-slot';

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

  const onSlotClick = (day: string, time: string) => {
    const newAvailability = changeAvailability(day, time, localValue, stepMinute);
    setLocalValue(newAvailability);
  };

  const onDayHeaderClick = (day: string) => {
    const newAvailability = changeDayAvailability(day, localValue, stepMinute);

    setLocalValue(newAvailability);
  };

  const getTimeColumn = () => {
    const slots = 1440 / stepMinute;
    return (
      <div>
        <div className="h-8 border-b bg-surface" />
        {Array.from({ length: slots }).map((_, i) => {
          const time = getTime(i, stepMinute);
          return (
            <div className="h-5 border-b bg-surface relative">
              <div className="text-xs absolute -top-4 right-1">{time}</div>
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
    <div className="border rounded-lg overflow-hidden min-w-xl grid grid-cols-8">
      {getTimeColumn()}
      {getDayColumn('Mon')}
      {getDayColumn('Tue')}
      {getDayColumn('Wed')}
      {getDayColumn('Thu')}
      {getDayColumn('Fri')}
      {getDayColumn('Sat')}
      {getDayColumn('Sun')}
    </div>
  );
};

export default AvailabilityTable;
