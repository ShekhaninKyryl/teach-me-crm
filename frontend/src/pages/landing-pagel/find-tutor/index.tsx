import FilterTutors from "components/filter-tutors";
import { useCallback, useEffect, useState } from "react";
import type { Filter } from "@shared/types/filter";
import tutorsApi from "api/tutors";
import type { Tutor } from "@shared/types/tutor";
import { Loading } from "components/common/loading";
import SortTutors from "components/sort-tutors";
import { useSort } from "hooks/useSort";
import TutorCardDialog from "components/tutor-card/tutor-card-dialog";

export const FindTutor = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const { sortList, sortedData, sortData } = useSort<Tutor>(["rating", "price"]);

  useEffect(() => {
    handleFindTutors();
  }, []);

  useEffect(() => {
    if (tutors.length > 0) {
      sortData(tutors, "rating");
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
    <div className="px-2 lg:px-4">
      {/*<TopTutors />*/}
      <div className="grid sm:gap-0 md:gap-4 mb-4 grid-cols-1 md:grid-cols-5">
        <div className="z-2 col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-1">
          <div className="sticky top-(--header-height) pt-4 grid gap-2">
            <SortTutors
              ratingSort={sortList.rating}
              priceSort={sortList.price}
              onSortChange={handleSortChange}
            />
            <FilterTutors onChange={findTutors} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:gap-6 col-span-3 lg:col-span-3 xl:col-span-4">
          {loading ? (
            <div className="flex items-center justify-center h-full w-full col-span-4">
              <Loading size={16} />
            </div>
          ) : (
            <div className="gap-4 auto-rows-fr z-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
              {sortedData.map((tutor) => (
                <TutorCardDialog tutor={tutor} key={tutor.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
