import { _ } from 'translates/index';
import { FilterTutors } from 'components/filter-tutors';
import { useCallback, useEffect, useState } from 'react';
import type { Filter } from 'types/filter';
import tutorsApi from 'api/tutors';
import type { Tutor } from 'types/tutor';
import { TutorCard } from 'components/tutor-card';
import { Loading } from 'components/common/loading';

export const FindTutor = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);

  useEffect(() => {
    handleFindTutors();
  }, []);

  const handleFindTutors = (filters: Filter[] = []) => {
    setLoading(true);
    setError(null);

    tutorsApi
      .searchTutors(JSON.stringify(filters))
      .then((data) => {
        setTutors(data);
        setLoading(false);
      })
      .catch((error) => setError(error));
  };

  const findTutors = useCallback(handleFindTutors, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-text mb-2">{_('Find tutor')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="md:col-span-2">
          <FilterTutors onChange={findTutors} />
        </div>

        {loading ? (
          <div className="md:col-span-2 lg:col-span-4 flex items-center justify-center h-32">
            <Loading size={16} />
          </div>
        ) : (
          <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutors.map((tutor) => (
              <TutorCard {...tutor} key={tutor.id} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
