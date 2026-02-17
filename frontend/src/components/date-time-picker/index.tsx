import { type FC, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { ChevronDownIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { enUS } from 'react-day-picker/locale';
import { _ } from '@/translates';
import { Text } from '@radix-ui/themes';
import { TIME_FORMAT } from 'constants/format';
import { debounce } from 'utils/throttle-debounce';
import classNames from 'classnames';

type Props = {
  startDate: Date;
  endDate: Date;
  errors: {
    start?: string;
    end?: string;
  };
  onChange: ([startDate, endDate]: Date[]) => void;
};

export const DateTimePicker: FC<Props> = ({ startDate, endDate, errors, onChange }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(() => startDate);
  const { lng } = useParams();
  const [startTime, setStartTime] = useState(() => startDate?.toLocaleTimeString(lng, TIME_FORMAT));
  const [endTime, setEndTime] = useState(() => endDate?.toLocaleTimeString(lng, TIME_FORMAT));

  const locale = lng === 'ua' ? uk : enUS;

  const handleDateChange = (newSelectedDate: Date | undefined) => {
    if (!newSelectedDate || !onChange) return;

    const updateDatePreservingTime = (oldDateValue: Date | number | undefined) => {
      const oldDate = oldDateValue ? new Date(oldDateValue) : new Date();
      const updated = new Date(newSelectedDate);

      updated.setHours(oldDate.getHours());
      updated.setMinutes(oldDate.getMinutes());
      updated.setSeconds(oldDate.getSeconds());
      updated.setMilliseconds(0);

      return updated;
    };

    const newStart = updateDatePreservingTime(startDate);
    const newEnd = updateDatePreservingTime(endDate);

    onChange([newStart, newEnd]);
    setOpen(false);
    setDate(newStart);
  };

  const handleStartChange = useMemo(() => {
    if (!onChange) return () => {};

    return (timeString: string) => {
      setStartTime(timeString);

      debounce(() => {
        const baseDate = startDate;
        const [hours, minutes, seconds] = timeString.split(':').map(Number);

        baseDate.setHours(hours || 0);
        baseDate.setMinutes(minutes || 0);
        baseDate.setSeconds(seconds || 0);
        baseDate.setMilliseconds(0);
        onChange([baseDate, endDate]);
      })();
    };
  }, [onChange, startDate, endDate]);

  const handleEndChange = useMemo(() => {
    if (!onChange) return () => {};

    return (timeString: string) => {
      setEndTime(timeString);

      debounce(() => {
        const baseDate = endDate;
        const [hours, minutes, seconds] = timeString.split(':').map(Number);

        baseDate.setHours(hours || 0);
        baseDate.setMinutes(minutes || 0);
        baseDate.setSeconds(seconds || 0);
        baseDate.setMilliseconds(0);
        onChange([startDate, baseDate]);
      })();
    };
  }, [onChange, startDate, endDate]);

  return (
    <div className="flex justify-between gap-4">
      <div className="flex-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full truncate font-normal">
              {date ? format(date, 'PPP', { locale: locale }) : 'Select date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <Calendar
              locale={locale}
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-2">
        <Text size="2">{_('From')}</Text>
        <Input
          className={classNames(
            errors?.start && 'border-destructive',
            'bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-fit'
          )}
          type="time"
          step="1"
          value={startTime}
          onChange={(e) => handleStartChange(e.target.value)}
        />
        <Text size="2">{_('To')}</Text>
        <Input
          className={classNames(
            errors?.end && 'border-destructive',
            'bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-fit'
          )}
          type="time"
          step="1"
          value={endTime}
          onChange={(e) => handleEndChange(e.target.value)}
        />
      </div>
    </div>
  );
};
