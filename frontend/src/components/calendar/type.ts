import type { EventContentArg } from "@fullcalendar/core";
import type { EventStatusType } from "@shared/types/event";

type EventExtendedProps = {
  studentId: string;
  tutorId: string;
  status: EventStatusType;
  weekly: boolean;
  color: string;
};

export type CustomEventContentArg = Omit<EventContentArg, "event"> & {
  event: Omit<EventContentArg["event"], "extendedProps"> & {
    extendedProps: EventExtendedProps;
  };
};
