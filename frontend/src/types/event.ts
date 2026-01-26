export const EventStatus = {
  Pending: 'pending',
  Rescheduled: 'reschedule',
  Cancelled: 'cancelled',
  Completed: 'completed',
  Paid: 'paid',
} as const;

export type EventStatusType = (typeof EventStatus)[keyof typeof EventStatus];

export type Event = {
  id: string;
  start: string;
  end: string;
  studentId: string;
  tutorId: string;
  title: string;
  status: EventStatusType;
  weekly?: boolean;
};
