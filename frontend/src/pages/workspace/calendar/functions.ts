import { type Event, type EventsFilter } from "@shared/types/event";

const filterEventsByStudents = (events: Event[], studentIds: string[]): Event[] => {
  if (studentIds.length === 0) return events;
  return events.filter((event) => studentIds.includes(event.studentId) || !event.studentId);
};

const filterEventsByStatuses = (events: Event[], statuses: string[]): Event[] => {
  if (statuses.length === 0) return events;
  return events.filter((event) => statuses.includes(event.status));
};

const getEventsWithoutArchived = (events: Event[]) => {
  return events.filter((event) => event.studentId);
};

export const filterEvents = (events: Event[], filter: EventsFilter): Event[] => {
  const { studentIds, statuses, showArchived } = filter;
  let filteredEvents = events;

  filteredEvents = filterEventsByStudents(filteredEvents, studentIds);
  filteredEvents = filterEventsByStatuses(filteredEvents, statuses);

  if (!showArchived) {
    filteredEvents = getEventsWithoutArchived(filteredEvents);
  }

  return filteredEvents;
};
