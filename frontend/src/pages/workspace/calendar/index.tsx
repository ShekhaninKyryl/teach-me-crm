import { Calendar } from '@/components/calendar';
import { useEffect, useState } from 'react';
import type { Event } from 'types/event';
import type { User } from 'types/user';
import eventApi from 'api/event';
import tutorsApi from 'api/tutors';
import { useAuth } from '@/contexts/auth-context';
import { Loading } from 'components/common/loading';

export const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Запускаємо запити паралельно для кращої продуктивності
        const [fetchedEvents, fetchedStudents] = await Promise.all([
          eventApi.getEvents(user.id),
          tutorsApi.getTutorsStudents(user.id),
        ]);

        setEvents(fetchedEvents);
        setStudents(fetchedStudents);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (!user || loading) return <Loading size={20} />;

  return (
    <div>
      <Calendar events={events} students={students} />
    </div>
  );
};
