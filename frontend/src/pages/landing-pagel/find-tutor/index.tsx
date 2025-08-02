import FilterTutors from 'components/filter-tutors';
import { useCallback, useEffect, useState } from 'react';
import type { Filter } from 'types/filter';
import tutorsApi from 'api/tutors';
import type { Tutor } from 'types/tutor';
import { Loading } from 'components/common/loading';
import { TutorCardMini } from 'components/tutor-card/tutor-car-mini';
import SortTutors from 'components/sort-tutors';
import { useSort } from 'hooks/useSort';
import { TopTutors } from 'pages/landing-pagel/find-tutor/top-tutors';
import { Label } from 'components/ui/label';
import { _ } from '@/translates';

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

  const handleSortChange = useCallback(
    (sortBy: string) => sortData(tutors, sortBy),
    [tutors, sortList]
  );

  const findTutors = useCallback(handleFindTutors, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
        <div className="lg:col-span-2 z-2">
          <div className="sticky top-28 grid gap-2">
            <SortTutors
              ratingSort={sortList.rating}
              priceSort={sortList.price}
              onSortChange={handleSortChange}
            />
            <FilterTutors onChange={findTutors} />
          </div>
        </div>
        <div className="lg:col-span-4 grid grid-cols-1">
          <TopTutors />
          {loading ? (
            <div className="lg:col-span-4 flex items-center justify-center h-full">
              <Loading size={16} />
            </div>
          ) : (
            <>
              <Label className="mb-2">
                <h2 className=" w-full scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-right">
                  {_('Filtered Tutors')}
                </h2>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr z-1">
                {sortedData.map((tutor) => (
                  <TutorCardMini {...tutor} key={tutor.id} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
