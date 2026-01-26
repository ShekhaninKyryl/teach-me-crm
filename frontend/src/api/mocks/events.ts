import { EventStatus, type Event } from 'types/event';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'evt-001',
    start: '2026-01-27T10:00:00Z',
    end: '2026-01-27T11:00:00Z',
    studentId: '1',
    tutorId: 'tr-501',
    title: 'Alex: Алгебра',
    status: EventStatus.Completed,
    weekly: true,
  },
  {
    id: 'evt-002',
    start: '2026-01-28T14:30:00Z',
    end: '2026-01-28T15:30:00Z',
    studentId: '2',
    tutorId: 'tr-501',
    title: 'Bob: Англійська мова',
    status: EventStatus.Pending,
  },
  {
    id: 'evt-003',
    start: '2026-01-29T16:00:00Z',
    end: '2026-01-29T17:00:00Z',
    studentId: '3',
    tutorId: 'tr-505',
    title: 'Petro: Оптика',
    status: EventStatus.Rescheduled,
    weekly: false,
  },
  {
    id: 'evt-004',
    start: '2026-01-30T09:00:00Z',
    end: '2026-01-30T10:00:00Z',
    studentId: '4',
    tutorId: 'tr-501',
    title: 'Kyryl: Програмування',
    status: EventStatus.Paid,
    weekly: true,
  },
];
