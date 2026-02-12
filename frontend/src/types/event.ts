export const EventStatus = {
  Pending: "pending",
  Rescheduled: "rescheduled",
  Cancelled: "cancelled",
  Completed: "completed",
  Paid: "paid",
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
