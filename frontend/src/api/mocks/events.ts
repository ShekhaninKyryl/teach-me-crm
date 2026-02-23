import { EventStatus, type Event } from "@shared/types/event";

export const MOCK_EVENTS: Event[] = [
  {
    id: "evt-001",
    timeRange: {
      start: new Date("2026-01-27T10:00:00Z"),
      end: new Date("2026-01-27T11:00:00Z"),
    },
    studentId: "1",
    tutorId: "tr-501",
    title: "Alex: Алгебра",
    description: "",
    status: EventStatus.Cancelled,
    weekly: false,
  },
  {
    id: "evt-002",
    timeRange: {
      start: new Date("2026-01-28T14:30:00Z"),
      end: new Date("2026-01-28T15:30:00Z"),
    },
    studentId: "2",
    tutorId: "tr-501",
    title: "Bob: Англійська мова",
    description: "",
    status: EventStatus.Pending,
  },
  {
    id: "evt-003",
    timeRange: {
      start: new Date("2026-01-29T16:00:00Z"),
      end: new Date("2026-01-29T17:00:00Z"),
    },
    studentId: "3",
    tutorId: "tr-505",
    title: "Petro: Оптика",
    status: EventStatus.Rescheduled,
    description: "",
    weekly: false,
  },
  {
    id: "evt-004",
    timeRange: {
      start: new Date("2026-01-29T16:00:00Z"),
      end: new Date("2026-01-29T17:00:00Z"),
    },
    studentId: "4",
    tutorId: "tr-501",
    title: "Kyryl: Програмування",
    status: EventStatus.Paid,
    description: "",
    weekly: false,
  },
];
