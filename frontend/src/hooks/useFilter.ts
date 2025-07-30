import { useCallback, useEffect, useMemo, useState } from 'react';
import subjectApi from 'api/subject';
import cityApi from 'api/city';
import type { Subject } from 'types/subject';
import type { Format } from 'types/common';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { Filter, FilterType } from 'types/filter';
import { debounce } from 'utils/throttle-debounce';
import { FILTER_DEBOUNCE_TIMER } from 'constants/timer';

type FilterState = {
  search?: string;
  subject?: Subject;
  format?: Format;
  city?: string;
};

type Selected = {
  type: FilterType;
  value: string;
  icon?: IconProp;
};

type FilterProps = {
  onChange: (selected: Filter[]) => void;
};

export const useFilter = ({ onChange }: FilterProps) => {
  const [isLoading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterState>({});
  const [selected, setSelected] = useState<Selected[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([subjectApi.getSubjects(), cityApi.getCities()]).then(
      ([subjectsRes, citiesRes]) => {
        setSubjects(subjectsRes);
        setCities(citiesRes);
        setLoading(false);
      }
    );
  }, []);

  const debouncedOnChange = useCallback(
    debounce((value: Selected[]) => {
      onChange(value.map(({ type, value }) => ({ type, value })));
    }, FILTER_DEBOUNCE_TIMER),
    []
  );

  useEffect(() => {
    if (!selected.length) return;
    debouncedOnChange(selected);
  }, [selected, onChange]);

  const filterSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      return !selected
        .filter(({ type }) => type === 'subject')
        .find(({ value }) => value === subject.label);
    });
  }, [selected, subjects]);

  const filterCities = useMemo(() => {
    return cities.filter((city) => {
      return !selected.filter(({ type }) => type === 'city').find(({ value }) => value === city);
    });
  }, [selected, cities]);

  const addSelected = (type: FilterType, value: string, icon?: IconProp) => {
    setSelected((prev) => {
      const existing = prev.find((s) => s.type === type && s.value === value);
      if (existing) {
        return prev;
      }
      return [...prev, { type, value, icon }];
    });
  };

  const removeSelected = (value: string) => {
    setSelected((prev) => prev.filter((s) => s.value !== value));
  };

  const findSelected = (value: string) => selected.find((s) => s.value === value);

  return {
    isLoading,
    filter,
    cities: filterCities,
    subjects: filterSubjects,
    selected,
    setFilter,
    addSelected,
    removeSelected,
    findSelected,
  };
};
