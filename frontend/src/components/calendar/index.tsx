import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { CustomContentGenerator, EventInput } from '@fullcalendar/core';
import ukLocale from '@fullcalendar/core/locales/uk';
import { useParams } from 'react-router-dom';
import { type Event, EventStatus } from 'types/event';
import type { User } from 'types/user';
import { type FC, useEffect, useRef } from 'react';
import { useSidebar } from 'components/ui/sidebar';
import { getFullCalendarEvents } from 'components/calendar/functions';
import type { CustomEventContentArg } from 'components/calendar/type';
import { EventDisplay } from 'components/calendar/event-display';

interface CalendarProps {
  events: Event[];
  students: User[];
}

export const Calendar: FC<CalendarProps> = ({ events, students }) => {
  const { lng } = useParams();
  const { open: isSideBarOpen } = useSidebar();
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.updateSize();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isSideBarOpen]);

  const lessons: EventInput[] = getFullCalendarEvents(events, students);

  const renderEventContent: CustomContentGenerator<CustomEventContentArg> = (eventInfo) => (
    <EventDisplay {...eventInfo} />
  );

  return (
    <FullCalendar
      ref={calendarRef}
      locales={[ukLocale]}
      locale={lng === 'ua' ? 'uk' : 'en'}
      height={800}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev today next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek',
      }}
      events={lessons}
      droppable={true}
      editable={true}
      selectable={true}
      eventClick={(info) => {
        console.log('Click', info);
      }}
      eventDrop={(info) => {
        console.log('Drop', info);
      }}
      select={(info) => {
        console.log('Select', info);
      }}
      eventContent={renderEventContent}
      eventClassNames={(arg) => {
        const status = arg.event.extendedProps.status;
        if (![EventStatus.Pending, EventStatus.Completed].includes(status)) {
          return 'opacity-50';
        }

        return '';
      }}
    />
  );
};
