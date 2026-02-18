import { type Event, type EventsFilter } from "@shared/types/event";

const filterEventsByStudents = (events: Event[], studentIds: string[]): Event[] => {
  if (studentIds.length === 0) return events;
  return events.filter((event) => studentIds.includes(event.studentId));
};

const filterEventsByStatuses = (events: Event[], statuses: string[]): Event[] => {
  if (statuses.length === 0) return events;
  return events.filter((event) => statuses.includes(event.status));
};

export const filterEvents = (events: Event[], filter: EventsFilter): Event[] => {
  const { studentIds, statuses } = filter;
  let filteredEvents = events;

  filteredEvents = filterEventsByStudents(filteredEvents, studentIds);
  filteredEvents = filterEventsByStatuses(filteredEvents, statuses);

  return filteredEvents;
};
