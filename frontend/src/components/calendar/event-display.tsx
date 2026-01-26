import type { FC } from 'react';
import type { CustomEventContentArg } from 'components/calendar/type';
import type { EventStatusType } from 'types/event';
import { StatusIcon } from 'components/calendar/status-icon';

export const EventDisplay: FC<CustomEventContentArg> = ({ event, timeText }) => {
  const status: EventStatusType = event.extendedProps.status;

  return (
    <div className="flex items-center gap-1 p-1 overflow-hidden">
      <StatusIcon status={status} />

      <div className="flex flex-col truncate">
        <span className="text-xs font-bold leading-none">{timeText}</span>
        <span className="text-xs truncate">{event.title}</span>
      </div>
    </div>
  );
};
