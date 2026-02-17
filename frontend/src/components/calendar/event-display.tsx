import type { FC } from 'react';
import type { CustomEventContentArg } from 'components/calendar/type';
import type { EventStatusType } from 'types/event';
import { StatusIcon } from 'components/calendar/status-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

export const EventDisplay: FC<CustomEventContentArg> = ({ event, timeText }) => {
  const status: EventStatusType = event.extendedProps.status;

  return (
    <div className="flex-1 flex items-start gap-1 overflow-hidden">
      <div className="flex flex-1 justify-between items-center">
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold leading-none">{timeText}</span>
          <Tooltip>
            <TooltipTrigger className="text-xs truncate  w-20">
              <span>{event.title}</span>
            </TooltipTrigger>
            <TooltipContent>{event.title}</TooltipContent>
          </Tooltip>
        </div>
        <div>
          <StatusIcon status={status} />
        </div>
      </div>
    </div>
  );
};
