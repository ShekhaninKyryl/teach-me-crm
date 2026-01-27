import type { FC } from 'react';
import type { CustomEventContentArg } from 'components/calendar/type';
import type { EventStatusType } from 'types/event';
import { StatusIcon } from 'components/calendar/status-icon';

export const EventDisplay: FC<CustomEventContentArg> = ({ event, timeText, view }) => {
  const status: EventStatusType = event.extendedProps.status;
  const typeOfView = view.type;

  return (
    <div className="flex items-start gap-2 overflow-hidden">
      {typeOfView === 'dayGridMonth' && (
        <div className="h-8 w-2 rounded-md" style={{ backgroundColor: event.backgroundColor }} />
      )}
      <StatusIcon status={status} />
      <div className="flex flex-col truncate">
        <span className="text-xs font-bold leading-none">{timeText}</span>
        <span className="text-xs truncate">{event.title}</span>
      </div>
    </div>
  );
};
