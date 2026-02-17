import { Calendar } from "@/components/calendar";
import { useEffect, useState } from "react";
import { type Event, type EventsFilter, EventStatus } from "types/event";
import type { User } from "types/user";
import eventApi from "api/event";
import tutorsApi from "api/tutors";
import { useAuth } from "@/contexts/auth-context";
import { Loading } from "components/common/loading";
import { PrimaryButton } from "components/common/button";
import { _ } from "@/translates";
import { EventFilter } from "components/calendar/event-filter";
import { Blockquote, Separator } from "@radix-ui/themes";
import { filterEvents } from "pages/workspace/calendar/functions";

export const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDirty, setDirty] = useState(false);
  const [filter, setFilter] = useState<EventsFilter>({ statuses: [], studentIds: [] });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedEvents, fetchedStudents] = await Promise.all([
          eventApi.getEvents(user.id),
          tutorsApi.getTutorsStudents(user.id),
        ]);

        setEvents(fetchedEvents);
        setStudents(fetchedStudents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleEventsChange = async (updatedEvents: Event[]) => {
    setDirty(true);
    setEvents(updatedEvents);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await eventApi.setEvents(events);
      setDirty(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleFilterChange = (newFilter: typeof filter) => setFilter(newFilter);

  if (!user || loading) return <Loading size={20} />;

  const filteredEvents = filterEvents(events, filter);

  return (
    <div className="flex flex-col gap-4">
      <Blockquote className="text-justify">{_("calendar_page.instruction")}</Blockquote>
      <EventFilter
        filter={filter}
        students={students}
        statuses={Object.values(EventStatus)}
        onChange={handleFilterChange}
      />
      <Separator className="w-full" />
      <Calendar
        tutorId={user.id}
        events={filteredEvents}
        students={students}
        onChange={handleEventsChange}
      />
      <div className="flex justify-end">
        <PrimaryButton
          disabled={loading || !isDirty}
          className="w-xs"
          title={_("Save")}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};
