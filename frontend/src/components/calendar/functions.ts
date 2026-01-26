import type { Event } from 'types/event';
import type { User } from 'types/user';
import type { EventInput } from '@fullcalendar/core';

function checkIsLight(color: string): boolean {
  if (!color) return true;
  // Спрощений алгоритм яскравості (якщо колір у форматі HEX)
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128; // true, якщо колір світлий
}

const getColorFullEvents = (events: Event[], students: User[]) =>
  events.map((event) => {
    const studentColor = students.find((s) => s.id === event.studentId)?.color;
    const isLight = checkIsLight(studentColor ?? '');
    return {
      ...event,
      backgroundColor: studentColor,
      borderColor: studentColor,
      textColor: isLight ? '#1c2024' : '#edeef0',
    };
  });

export const getFullCalendarEvents = (events: Event[], students: User[]): EventInput[] => {
  const colorizedEvents = getColorFullEvents(events, students);

  return colorizedEvents.map((event) => {
    const baseEvent: EventInput = {
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      textColor: event.textColor,
      id: event.id,
      title: event.title,
      overlap: false,
      extendedProps: {
        studentId: event.studentId,
        tutorId: event.tutorId,
        status: event.status,
        weekly: event.weekly,
      },
    };

    if (event.weekly) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);

      return {
        ...baseEvent,
        daysOfWeek: [startDate.getUTCDay()],
        startTime: startDate.toISOString().split('T')[1].substring(0, 5),
        endTime: endDate.toISOString().split('T')[1].substring(0, 5),
        startRecur: event.start,
      };
    }

    return {
      ...baseEvent,
      start: event.start,
      end: event.end,
    };
  });
};
