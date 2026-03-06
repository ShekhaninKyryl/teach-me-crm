import type { FC } from "react";
import type { CustomEventContentArg } from "components/calendar/type";
import type { EventStatusType } from "@shared/types/event";
import { StatusIcon } from "components/calendar/status-icon";
import classNames from "classnames";

export const EventDisplay: FC<CustomEventContentArg> = ({ event, view, timeText }) => {
  const status: EventStatusType = event.extendedProps.status;
  const isMonthView = view.type === "dayGridMonth";

  return (
    <div className="w-full">
      <div className="text-xs font-bold">{timeText}</div>
      <div className={classNames("text-xs truncate text-left", isMonthView && "mr-5")}>
        {event.title}
      </div>
      <div className="absolute right-0 bottom-0">
        <StatusIcon status={status} />
      </div>
    </div>
  );
};
