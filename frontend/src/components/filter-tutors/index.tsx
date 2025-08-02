import { _ } from '@/translates';
import { SelectorInput } from 'components/common/selector/selector-input';
import { useFilter } from 'hooks/useFilter';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Loading } from 'components/common/loading';
import type { Filter } from 'types/filter';

import React, { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { Badge } from 'components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { X } from 'lucide-react';
import { PriceRange } from 'components/price-range';
import { RANGE_THROTTLE_TIMER } from 'constants/timer';
import { throttle } from 'utils/throttle-debounce';

type FilterTutorsProps = {
  onChange: (selected: Filter[]) => void;
};

export const FilterTutorsComponent = ({ onChange }: FilterTutorsProps) => {
  const {
    isLoading,
    subjects,
    cities,
    minMaxPriceRange: { min, max },
    selected,
    removeSelected,
    addSelected,
    findSelected,
  } = useFilter();
  const [search, setSearch] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>(() => [min, max]);

  useEffect(() => {
    setPriceRange([min, max]);
  }, [min, max]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleSearchAdd = () => {
    if (search.trim() === '') return;
    addSelected('search', search);
    setSearch('');
  };

  const handleDebouncedPriceChange = useCallback(
    throttle((range: number[]) => {
      const existing = findSelected({ filterType: 'price' });
      if (existing) {
        removeSelected(existing.value);
      }

      addSelected('price', `${range[0]}-${range[1]} ₴`);
    }, RANGE_THROTTLE_TIMER),
    [findSelected, removeSelected, addSelected]
  );

  const handleRangePriceChange = (range: number[]) => {
    setPriceRange(range);
    handleDebouncedPriceChange(range);
  };

  const handleSubjectChange = (value: string | undefined) => {
    if (value) {
      const subject = subjects.find((s) => s.id === value);
      if (subject) {
        addSelected('subject', subject.label, subject.faIcon);
      }
    }
  };
  const handleCityChange = (value: string | undefined) => {
    if (value) {
      addSelected('city', value);
    }
  };
  const handleFormatChange = (format: 'online' | 'offline') => {
    const existing = selected.find((s) => s.type === 'format' && s.value === format);
    if (existing) {
      removeSelected(existing.value);
      return;
    }
    addSelected('format', format);
  };

  const handleFindTutors = () => {
    onChange(selected);
  };

  const offlineChecked = Boolean(findSelected({ value: 'offline', filterType: 'format' }));
  const onlineChecked = Boolean(findSelected({ value: 'online', filterType: 'format' }));

  if (isLoading) {
    return (
      <div className="mx-auto py-4 px-4 mb-2 bg-background-secondary">
        <h2 className="text-xl font-bold text-text mb-2">{_('Filters')}</h2>
        <Loading />
      </div>
    );
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle> {_('Filters')}</CardTitle>
        <CardDescription> {_('Select filters to find the best tutor for you')}</CardDescription>
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(({ value, icon }) => (
            <Badge key={value}>
              {icon && <FontAwesomeIcon icon={icon} className="mr-1" />}
              {value}
              <button
                onClick={() => removeSelected(value)}
                className="hover:text-secondary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-3">
          <Label>{_("Searching by subject, tutor's name or location")}</Label>
          <div className="flex w-full items-center gap-2">
            <Input
              type="text"
              placeholder={_('Enter search term...')}
              value={search || ''}
              onChange={handleSearchChange}
            />
            <Button
              variant="outline"
              disabled={
                search === '' ||
                Boolean(search && findSelected({ value: search, filterType: 'search' }))
              }
              onClick={handleSearchAdd}
            >
              {_('Search')}
            </Button>
          </div>
        </div>
        <div className="grid w-full items-center gap-3 mt-4">
          <Label>{_('Select a format')}</Label>
          <div className="flex items-center gap-3">
            <Checkbox
              title={_('Online')}
              checked={onlineChecked}
              onClick={() => handleFormatChange('online')}
            />
            <Label>{_('Online')}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              title={_('Offline')}
              checked={offlineChecked}
              onClick={() => handleFormatChange('offline')}
            />
            <Label>{_('Offline')}</Label>
          </div>
        </div>
        <div className="grid w-full items-center gap-3 mt-4">
          <SelectorInput
            placeholder={_('Select a subject')}
            options={subjects.map((subject) => ({
              value: subject.id,
              label: subject.label,
              icon: (subject.faIcon as IconProp) || (subject.icon as IconProp),
            }))}
            onChange={handleSubjectChange}
          />
          {/*  /!* City Selector *!/*/}
          <SelectorInput
            placeholder={_('Select a city')}
            options={cities.map((city) => ({
              value: city,
              label: city,
            }))}
            onChange={handleCityChange}
          />
          <PriceRange value={priceRange} min={min} max={max} onChange={handleRangePriceChange} />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button disabled={!selected.length} className="w-full" onClick={handleFindTutors}>
          {_('Apply Filters')}
        </Button>
      </CardFooter>
    </Card>
  );
};

const FilterTutors = React.memo(FilterTutorsComponent);

export default FilterTutors;
