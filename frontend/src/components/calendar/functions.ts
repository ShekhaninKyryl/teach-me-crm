import i18n from "i18next";
import { type Event, EventStatus, type EventStatusType } from "@shared/types/event";
import type { EventInput } from "@fullcalendar/core";
import type { Student } from "@shared/types/students";

export const getFullCalendarEvents = (events: Event[], students: Student[]): EventInput[] => {
  return events.map((event) => {
    const baseEvent: EventInput = {
      id: event.id,
      title: event.title,
      editable: isEditableEvent(event.status),
      extendedProps: {
        studentId: event.studentId,
        tutorId: event.tutorId,
        status: event.status,
        weekly: event.weekly,
        description: event.description,
        price: event.price,
        color: students.find((s) => s.id === event.studentId)?.color,
      },
    };

    if (event.weekly) {
      const startDate = new Date(event.timeRange?.start || "");
      const endDate = new Date(event.timeRange?.end || "");

      return {
        ...baseEvent,
        daysOfWeek: [startDate.getUTCDay()],
        startTime: startDate.toISOString().split("T")[1].substring(0, 5),
        endTime: endDate.toISOString().split("T")[1].substring(0, 5),
        startRecur: event.timeRange?.start,
      };
    }

    return {
      ...baseEvent,
      start: event.timeRange?.start,
      end: event.timeRange?.end,
    };
  });
};

export const isEditableEvent = (status: EventStatusType): boolean => {
  const editableStatuses: EventStatusType[] = [EventStatus.Pending];
  return editableStatuses.includes(status);
};

export const getLocalizedLessonTitle = (studentName?: string) => {
  const name = studentName || "unnamed";

  switch (i18n.language) {
    case "ua":
      return `Урок з ${name}`;
    case "en":
    default:
      return `Lesson with ${name}`;
  }
};
