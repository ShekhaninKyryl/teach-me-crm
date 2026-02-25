import { useEffect, useMemo, useState } from "react";
import subjectApi from "api/subject";
import cityApi from "api/city";
import priceApi from "api/price";
import type { Subject } from "types/subject";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { FilterType } from "@shared/types/filter";

type Selected = {
  type: FilterType;
  value: string;
  icon?: IconProp;
};

export const useFilter = () => {
  const [selected, setSelected] = useState<Selected[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [minMaxPriceRange, setMinMaxPriceRange] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([subjectApi.getSubjects(), cityApi.getCities(), priceApi.getPriceRange()])
      .then(([subjectsRes, citiesRes, priceRes]) => {
        setSubjects(subjectsRes as Subject[]);
        setCities(citiesRes);
        setMinMaxPriceRange(priceRes);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filterSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      return !selected
        .filter(({ type }) => type === "subject")
        .find(({ value }) => value === subject.label);
    });
  }, [selected, subjects]);

  const filterCities = useMemo(() => {
    return cities.filter((city) => {
      return !selected.filter(({ type }) => type === "city").find(({ value }) => value === city);
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
    setDisabled(false);
  };

  const removeSelected = (value: string) => {
    setSelected((prev) => prev.filter((s) => s.value !== value));
    setDisabled(false);
  };

  const findSelected = ({ value, filterType }: { value?: string; filterType?: FilterType }) =>
    selected.find((s) => {
      if (value && filterType) {
        return s.value === value && s.type === filterType;
      }
      if (value) {
        return s.value === value;
      }
      if (filterType) {
        return s.type === filterType;
      }
      return false;
    });

  return {
    isLoading,
    cities: filterCities,
    subjects: filterSubjects,
    minMaxPriceRange: {
      min: minMaxPriceRange[0],
      max: minMaxPriceRange[1],
    },
    selected,
    disabled,
    setDisabled,
    addSelected,
    removeSelected,
    findSelected,
  };
};
