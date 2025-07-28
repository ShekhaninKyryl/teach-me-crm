import { useEffect, useState } from 'react';
import subjectApi from 'api/subject';
import cityApi from 'api/city';
import type { Subject } from 'types/subject';
import type { Format } from 'types/common';

type FilterState = {
  search?: string;
  subject?: Subject;
  format?: Format;
  city?: string;
};

type SelectedType = 'subject' | 'format' | 'city' | 'search';

type Selected = {
  type: SelectedType;
  value: string;
  icon?: string;
};

export const useFilter = () => {
  const [filter, setFilter] = useState<FilterState>({});
  const [selected, setSelected] = useState<Selected[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    subjectApi.getSubjects().then((res) => setSubjects(res));
    cityApi.getCities().then((res) => setCities(res));
  }, []);

  const addSelected = (type: SelectedType, value: string, icon?: string) => {
    setSelected((prev) => {
      const existing = prev.find((s) => s.type === type && s.value === value);
      if (existing) {
        return prev.filter((s) => s !== existing);
      }
      return [...prev, { type, value, icon }];
    });
  };

  const removeSelected = (value: string) => {
    setSelected((prev) => prev.filter((s) => s.value !== value));
  };

  return {
    filter,
    cities,
    subjects,
    selected,
    setFilter,
    addSelected,
    removeSelected,
  };
};
