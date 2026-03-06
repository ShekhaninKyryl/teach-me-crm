import type { FC } from "react";
import type { CustomEventContentArg } from "components/calendar/type";
import type { EventStatusType } from "@shared/types/event";
import { StatusIcon } from "components/calendar/status-icon";
import classNames from "classnames";

type Props = CustomEventContentArg & {
  unresolved?: boolean;
};

export const EventDisplay: FC<Props> = ({ event, view, timeText, unresolved }) => {
  const status: EventStatusType = event.extendedProps.status;
  const isMonthView = view.type === "dayGridMonth";

  return (
    <div className="w-full">
      <div className="text-xs font-bold">
        {unresolved && "⚠️"}
        {timeText}
      </div>
      <div className={classNames("text-xs truncate text-left", isMonthView && "mr-5")}>
        {event.title}
      </div>
      <div className="absolute bottom-0 right-0 ">
        <StatusIcon status={status} />
      </div>
    </div>
  );
};
