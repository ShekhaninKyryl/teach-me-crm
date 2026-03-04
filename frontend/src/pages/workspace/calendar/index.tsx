import { Calendar } from "@/components/calendar";
import { useEffect, useState } from "react";
import { type Event, type EventsFilter, EventStatus } from "@shared/types/event";
import eventApi from "api/event";
import tutorsApi from "api/tutors";
import { useAuth } from "@/contexts/auth-context";
import { Loading } from "components/common/loading";
import { PrimaryButton } from "components/common/button";
import { _ } from "@/translates";
import { EventFilter } from "components/calendar/event-filter";
import { Blockquote, Separator } from "@radix-ui/themes";
import { filterEvents } from "pages/workspace/calendar/functions";
import type { Student } from "@shared/types/students";

type PendingChanges = {
  created: Event[];
  updated: Event[];
  deleted: string[];
};

export const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({
    created: [],
    updated: [],
    deleted: [],
  });
  const [students, setStudents] = useState<Student[]>([]);
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

  const trackCreatedEvent = async (event: Event) => {
    setPendingChanges((prev) => ({
      ...prev,
      created: [...prev.created, event],
    }));
  };

  const trackUpdatedEvent = async (event: Event) => {
    setPendingChanges((prev) => {
      const isNew = prev.created.some((e) => e.id === event.id);

      if (isNew) {
        return {
          ...prev,
          created: prev.created.map((e) => (e.id === event.id ? event : e)),
        };
      }

      const alreadyUpdated = prev.updated.some((e) => e.id === event.id);
      return {
        ...prev,
        updated: alreadyUpdated
          ? prev.updated.map((e) => (e.id === event.id ? event : e))
          : [...prev.updated, event],
      };
    });
  };

  const trackDeletedEvent = async (eventId: string) => {
    setPendingChanges((prev) => {
      const isNew = prev.created.some((e) => e.id === eventId);

      if (isNew) {
        return {
          ...prev,
          created: prev.created.filter((e) => e.id !== eventId),
        };
      }
      return {
        ...prev,
        updated: prev.updated.filter((e) => e.id !== eventId),
        deleted: [...prev.deleted, eventId],
      };
    });
  };

  const handleSubmit = async () => {
    if (Object.values(pendingChanges).every((arr) => arr.length === 0)) return;

    setLoading(true);
    try {
      if (pendingChanges.deleted.length > 0) {
        await Promise.all(pendingChanges.deleted.map((id) => eventApi.deleteEvent(id)));
      }

      await Promise.all(
        [
          pendingChanges.created.length > 0 && eventApi.createEvents(pendingChanges.created),
          pendingChanges.updated.length > 0 && eventApi.updateEvents(pendingChanges.updated),
        ].filter(Boolean)
      );

      setPendingChanges({ created: [], updated: [], deleted: [] });
      setDirty(false);
    } catch (error) {
      console.error("Failed to sync events:", error);
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
        onAdd={trackCreatedEvent}
        onEdit={trackUpdatedEvent}
        onDelete={trackDeletedEvent}
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
