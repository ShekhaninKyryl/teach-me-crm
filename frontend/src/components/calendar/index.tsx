import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  CustomContentGenerator,
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import ukLocale from "@fullcalendar/core/locales/uk";
import { useParams } from "react-router-dom";
import { type Event } from "@shared/types/event";
import type { User } from "@shared/types/user";
import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { useSidebar } from "components/ui/sidebar";
import { getFullCalendarEvents, isEditableEvent } from "components/calendar/functions";
import type { CustomEventContentArg } from "components/calendar/type";
import { EventDisplay } from "components/calendar/event-display";
import classNames from "classnames";
import { EventDialog } from "components/calendar/event-dialog";

interface CalendarProps {
  tutorId: string;
  events: Event[];
  students: User[];
  onChange: (events: Event[]) => void;
}

export const Calendar: FC<CalendarProps> = ({ tutorId, events, students, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [timeRange, setTimeRange] = useState<{ start: Date; end: Date }>();
  const { lng } = useParams();
  const { open: isSideBarOpen } = useSidebar();
  const calendarRef = useRef<FullCalendar>(null);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return;
    return events.find((e) => e.id === selectedEventId);
  }, [selectedEventId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.updateSize();
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isSideBarOpen]);

  const handleEventUpdate = (updatedEvent: Event) => {
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    onChange(updatedEvents);
  };

  const handleEventCreate = (newEvent: Event) => {
    onChange([...events, newEvent]);
  };

  const handleSubmit = (event: Event) => {
    if (selectedEvent) {
      handleEventUpdate(event);
    } else {
      handleEventCreate(event);
    }
    setIsModalOpen(false);
    setSelectedEventId("");
    setTimeRange(undefined);
  };

  const handleSelect = ({ start, end }: DateSelectArg) => {
    setIsModalOpen(true);
    setSelectedEventId("");
    setTimeRange({ start, end });
  };

  const handleClick = ({ event }: EventClickArg) => {
    setIsModalOpen(true);
    setSelectedEventId(event.id);
  };

  const handleDrop = ({ event }: EventDropArg) => {
    //TODO implement event time update after drag-and-drop
    setSelectedEventId(event.id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedEventId("");
    setTimeRange(undefined);
  };

  const renderEventContent: CustomContentGenerator<CustomEventContentArg> = (eventInfo) => (
    <EventDisplay {...eventInfo} />
  );
  const lessons: EventInput[] = getFullCalendarEvents(events, students);

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        events={lessons}
        locales={[ukLocale]}
        locale={lng === "ua" ? "uk" : "en"}
        height={800}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev today next",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        selectAllow={(selectInfo) => {
          const start = selectInfo.start;
          const end = selectInfo.end;

          const adjustedEnd = new Date(end.getTime() - 1);

          return start.toDateString() === adjustedEnd.toDateString();
        }}
        droppable={true}
        editable={true}
        selectable={true}
        eventContent={renderEventContent}
        eventClassNames={(arg) => {
          const status = arg.event.extendedProps.status;
          const isEditable = isEditableEvent(status);

          return classNames(isEditable ? "cursor-pointer" : "cursor-zoom-in", "m-0! p-0! pr-2!");
        }}
        eventDidMount={(info) => {
          const color = info.event.extendedProps.color;
          if (color) {
            info.el.style.border = "0";
            info.el.style.borderLeft = `3px solid ${color}`;
            info.el.style.borderTopLeftRadius = "0";
            info.el.style.borderBottomLeftRadius = "0";
          }
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        select={handleSelect}
        eventClick={handleClick}
        eventDrop={handleDrop}
      />
      {isModalOpen && (
        <EventDialog
          open={isModalOpen}
          tutorId={tutorId}
          selectedEvent={selectedEvent}
          students={students}
          timeRange={timeRange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};
