export const EventStatus = {
  Pending: "PENDING",
  Rescheduled: "RESCHEDULED",
  Cancelled: "CANCELLED",
  Completed: "COMPLETED",
  Paid: "PAID",
} as const;

export type EventStatusType = (typeof EventStatus)[keyof typeof EventStatus];

export type Event = {
  id: string;
  tutorId: string;
  studentId: string;
  title: string;
  description?: string;
  timeRange?: {
    start: Date;
    end: Date;
  };
  weekly?: boolean;
  status: EventStatusType;
  price?: number;
};

export type EventsFilter = {
  studentIds: string[];
  statuses: string[];
};
