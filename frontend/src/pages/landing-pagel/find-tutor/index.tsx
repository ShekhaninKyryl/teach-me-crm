import { FilterTutors } from 'components/filter-tutors';
import { useCallback, useEffect, useState } from 'react';
import type { Filter } from 'types/filter';
import tutorsApi from 'api/tutors';
import type { Tutor } from 'types/tutor';
import { Loading } from 'components/common/loading';
import { TutorCardMini } from 'components/tutor-card/tutor-car-mini';
import { SortTutors } from 'components/sort-tutors';
import { useSort } from 'hooks/useSort';

export const FindTutor = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const { sortList, sortedData, sortData } = useSort<Tutor>(['rating', 'price']);

  useEffect(() => {
    handleFindTutors();
  }, []);

  useEffect(() => {
    if (tutors.length > 0) {
      sortData(tutors, 'rating');
    }
  }, [tutors]);

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
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
        <div className="lg:col-span-2 z-2">
          <div className="sticky top-36">
            <SortTutors
              ratingSort={sortList.rating}
              priceSort={sortList.price}
              onSortChange={(sortBy) => sortData(tutors, sortBy)}
            />
            <FilterTutors onChange={findTutors} />
          </div>
        </div>
        {loading ? (
          <div className="lg:col-span-4 flex items-center justify-center h-full">
            <Loading size={16} />
          </div>
        ) : (
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr z-1">
            {sortedData.map((tutor) => (
              <TutorCardMini {...tutor} key={tutor.id} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
