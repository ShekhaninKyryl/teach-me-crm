/*
  ['Mon:1200-1400', 'Mon:1700-2100', 'Fri:0830-2300']
 */
import type { FC } from 'react';
import { clsx } from 'clsx';
import { _ } from '@/translates';

const getTimeLabel = (slotIndex: number, step = 60) => {
  const totalMinutes = slotIndex * step; // Кількість хвилин з початку доби
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

type AvailabilityList = string[];

type AvailabilityTableProps = {
  format: 'week';
  step: '1h' | '30m';
  onChange: (availability: AvailabilityList) => void;
};

const AvailabilityTable: FC<AvailabilityTableProps> = ({
  step = '1h',
  format = 'week',
  onChange,
}) => {
  // Наприклад, для тижня: 7 днів × 24 години
  const days = format === 'week' ? 7 : 1;
  const hours = step === '1h' ? 24 : 48; // 48 = 30 хв * 24 год

  const getTimeColumn = () => {
    const stepMinute = step === '1h' ? 60 : 30;
    const slots = (1440 + 60) / stepMinute;
    return (
      <div>
        <div className="h-8 border-b bg-surface" />
        {Array.from({ length: slots }).map((_, i) => {
          return (
            <div className="h-5 text-center text-sm border-b bg-surface">
              {getTimeLabel(i, stepMinute)}
            </div>
          );
        })}
      </div>
    );
  };

  const getDayColumn = (day: string) => {
    const stepMinute = step === '1h' ? 60 : 30;
    const slots = (1440 + 60) / stepMinute;
    return (
      <div>
        <div className="h-8 text-center font-semibold border-b bg-surface py-2">{day}</div>
        {Array.from({ length: slots }).map((_, i) => {
          return (
            <div className="h-5 text-center text-secondary text-sm border-b border-l border-chart-2 bg-chart-2">
              {getTimeLabel(i, stepMinute)}
            </div>
          );
        })}
      </div>
    );
  };

  const getHeader = () => {
    return Array.from({ length: days + 1 }).map((_, i) => (
      <div key={`day-${i}`} className="text-center font-semibold border-b bg-surface py-2">
        {format === 'week' ? ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : 'Today'}
      </div>
    ));
  };

  // Генеруємо масив для відображення клітинок
  const cells = Array.from({ length: days * hours });

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

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Заголовок днів */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${days + 1}, 1fr)`,
        }}
      >
        {getHeader()}
      </div>

      {/* Клітинки часу */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${days}, 1fr)`,
        }}
      >
        {cells.map((_, i) => (
          <div
            key={`cell-${i}`}
            className={clsx(
              'h-8 border cursor-pointer hover:bg-accent transition-colors',
              i % days === 0 && 'border-l-0',
              i < days && 'border-t-0'
            )}
            onClick={() => {
              // Тут можна додати логіку вибору
              onChange([`slot-${i}`]);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailabilityTable;
