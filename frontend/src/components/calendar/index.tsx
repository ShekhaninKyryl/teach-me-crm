import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { type EventResizeDoneArg } from "@fullcalendar/interaction";
import type {
  CustomContentGenerator,
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import ukLocale from "@fullcalendar/core/locales/uk";
import { useParams } from "react-router-dom";
import { type Event, EventStatus } from "@shared/types/event";
import { type FC, useEffect, useMemo, useRef, useState } from "react";
import { useSidebar } from "components/ui/sidebar";
import { getFullCalendarEvents } from "components/calendar/functions";
import type { CustomEventContentArg, DragEventVariantType } from "components/calendar/type";
import { EventDisplay } from "components/calendar/event-display";
import classNames from "classnames";
import { EventDialog } from "components/calendar/event-dialog";
import type { Student } from "@shared/types/students";
import { EventDragDialog } from "components/calendar/event-drag-dialog";
import { v4 as uuidv4 } from "uuid";

interface CalendarProps {
  tutorId: string;
  events: Event[];
  students: Student[];
  onChange: (events: Event[]) => void;

  onAdd: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export const Calendar: FC<CalendarProps> = ({
  tutorId,
  events,
  students,
  onChange,
  onAdd,
  onEdit,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDragModalOpen, setIsDragModalOpen] = useState(false);
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
    onEdit(updatedEvent);
    onChange(updatedEvents);
  };

  const handleEventCreate = (newEvent: Event) => {
    onAdd(newEvent);
    onChange([...events, newEvent]);
  };

  const handleSubmit = (event: Event) => {
    if (selectedEvent) {
      handleEventUpdate(event);
    } else {
      handleEventCreate(event);
    }

    handleCancel();
  };

  const handleDragComplete = ({
    variant,
    event,
    oldEvent,
  }: {
    variant: DragEventVariantType;
    event: Event;
    oldEvent: Event;
  }) => {
    switch (variant) {
      case "MOVE": {
        handleEventUpdate(event);
        break;
      }
      case "RESCHEDULE": {
        const rescheduledOld: Event = { ...oldEvent, status: EventStatus.Rescheduled };
        const createdNew: Event = { ...event, id: uuidv4() };

        onEdit(rescheduledOld);
        onAdd(createdNew);

        const nextEvents = [
          ...events.map((e) => (e.id === rescheduledOld.id ? rescheduledOld : e)),
          createdNew,
        ];

        onChange(nextEvents);
        break;
      }
      default:
        throw new Error("Handle drag complete with unknown event variant");
    }

    handleCancel();
  };

  const handleSelect = ({ start, end }: DateSelectArg) => {
    setIsEditModalOpen(true);
    setSelectedEventId("");
    setTimeRange({ start, end });
  };

  const handleClick = ({ event }: EventClickArg) => {
    setIsEditModalOpen(true);
    setSelectedEventId(event.id);
  };

  const handleDrop = ({ event }: EventDropArg) => {
    const { start, end } = event;
    if (!start || !end) {
      throw new Error("Can't detect time range for event");
    }

    setIsDragModalOpen(true);
    setTimeRange({ start, end });
    setSelectedEventId(event.id);
  };

  const handleResize = ({ event }: EventResizeDoneArg) => {
    const selectedEvent = events.find((e) => e.id === event.id);
    if (!selectedEvent || !selectedEvent.studentId) return;

    const { start, end } = event;
    if (!start || !end) {
      throw new Error("Can't detect time range for event");
    }

    handleEventUpdate({ ...selectedEvent, timeRange: { start, end } });
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsDragModalOpen(false);
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
        handleWindowResize={true}
        windowResizeDelay={200}
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
          const isEditable = EventStatus.Pending === status;
          const isArchived = !arg.event.extendedProps.studentId;

          const cursor = isArchived
            ? "cursor-default"
            : isEditable
              ? "cursor-pointer"
              : "cursor-zoom-in";

          return classNames(cursor);
        }}
        eventDidMount={(info) => {
          const color = info.event.extendedProps.color;

          info.el.style.border = "0";
          info.el.style.borderLeft = `3px solid ${color || "gray"}`;
          info.el.style.borderTopLeftRadius = "0";
          info.el.style.borderBottomLeftRadius = "0";
          info.el.style.overflow = "hidden";

          if (!info.event.extendedProps.studentId) {
            info.el.style.opacity = "50%";
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
        eventResize={handleResize}
      />
      {isEditModalOpen && (
        <EventDialog
          open={isEditModalOpen}
          tutorId={tutorId}
          selectedEvent={selectedEvent}
          students={students}
          timeRange={timeRange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
      {isDragModalOpen && timeRange && selectedEvent && (
        <EventDragDialog
          open={isDragModalOpen}
          selectedEvent={selectedEvent}
          timeRange={timeRange}
          onCancel={handleCancel}
          onSubmit={handleDragComplete}
        />
      )}
    </>
  );
};
