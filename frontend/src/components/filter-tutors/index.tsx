import { _ } from '@/translates';
import { SelectorInput } from 'components/common/selector/selector-input';
import { Input } from 'components/common/input';
import { PrimaryButton } from 'components/common/button';
import { useFilter } from 'hooks/useFilter';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Chiclet } from 'components/common/chiclet';
import { Loading } from 'components/common/loading';
import type { Filter, FilterType } from 'types/filter';
import { FILTER_DEBOUNCE_TIMER } from 'constants/timer';
import { ProgressBarWithTimer } from 'components/common/progress-bar/progress-bar-with-timer';
import { useState } from 'react';
import { RangeSlider } from 'components/common/slider';

type FilterTutorsProps = {
  onChange: (selected: Filter[]) => void;
};

export const FilterTutors = ({ onChange }: FilterTutorsProps) => {
  const {
    isLoading,
    filter,
    setFilter,
    subjects,
    cities,
    selected,
    removeSelected,
    addSelected,
    findSelected,
  } = useFilter({ onChange });
  const [timerKey, setTimerKey] = useState(0);

  const addSelectedWithTimer = (type: FilterType, value: string, icon?: IconProp) => {
    addSelected(type, value, icon);
    setTimerKey((prev) => prev + 1);
  };

  const removeSelectedWithTimer = (value: string) => {
    removeSelected(value);
    setTimerKey((prev) => prev + 1);
  };

  const handleSearchChange = (value: string) => {
    setFilter((prev) => ({ ...prev, search: value }));
  };
  const handleSearchAdd = () => {
    if (filter.search) {
      addSelectedWithTimer('search', filter.search);
      setFilter((prev) => ({ ...prev, search: '' }));
    }
  };
  const handleSubjectChange = (value: string | undefined) => {
    if (value) {
      const subject = subjects.find((s) => s.id === value);
      if (subject) {
        addSelectedWithTimer('subject', subject.label, subject.faIcon);
      }
    }
  };
  const handleCityChange = (value: string | undefined) => {
    if (value) {
      addSelectedWithTimer('city', value);
    }
  };
  const handleFormatChange = (format: 'online' | 'offline') => {
    const existing = selected.find((s) => s.type === 'format');
    if (existing) {
      removeSelectedWithTimer(existing.value);
    }
    addSelectedWithTimer('format', format);
    setFilter((prev) => ({ ...prev, format: format }));
  };

  if (isLoading) {
    return (
      <div className="mx-auto py-4 px-4 mb-2 bg-background-secondary">
        <h2 className="text-xl font-bold text-text mb-2">{_('Filters')}</h2>
        <Loading />
      </div>
    );
  }
  return (
    <div className="relative mx-auto py-4 px-4 mb-2 bg-background-secondary">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text mb-2">{_('Filters')}</h2>
      </div>

      {/* Selected Filters */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map(({ value, icon }) => (
          <Chiclet
            key={value}
            label={value}
            icon={icon}
            onClose={() => removeSelectedWithTimer(value)}
          />
        ))}
      </div>

      <div className="flex gap-4 mb-4 items-end">
        <Input
          label={_("Searching by subject, tutor's name or location")}
          type="text"
          placeholder={_('Enter search term...')}
          className="w-full"
          onChange={handleSearchChange}
          value={filter.search || ''}
        />
        <PrimaryButton
          disabled={filter.search === '' || Boolean(filter.search && findSelected(filter.search))}
          title={_('Search')}
          className="min-w-24"
          onClick={handleSearchAdd}
        />
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {/* Format of Classes Selector*/}
        <div className="grid grid-cols-2 gap-4">
          <PrimaryButton
            title={_('Online')}
            disabled={Boolean(findSelected('online'))}
            onClick={() => handleFormatChange('online')}
          />
          <PrimaryButton
            title={_('Offline')}
            disabled={Boolean(findSelected('offline'))}
            onClick={() => handleFormatChange('offline')}
          />
        </div>

        {/* Subject Selector */}
        <SelectorInput
          value={filter.subject?.id}
          placeholder={_('Select a subject')}
          options={subjects.map((subject) => ({
            value: subject.id,
            label: subject.label,
            icon: (subject.faIcon as IconProp) || (subject.icon as IconProp),
          }))}
          onChange={handleSubjectChange}
        />
        {/* City Selector */}
        <SelectorInput
          value={filter.city}
          placeholder={_('Select a city')}
          options={cities.map((city) => ({
            value: city,
            label: city,
          }))}
          onChange={handleCityChange}
        />

        <RangeSlider values={[20, 46]} onChange={(v) => console.log(v)} />
      </div>

      {timerKey ? (
        <div className="absolute bottom-0 left-0 w-full flex">
          <ProgressBarWithTimer
            key={timerKey}
            timer={FILTER_DEBOUNCE_TIMER}
            color="accent"
            strokeWidth={4}
          />
        </div>
      ) : null}
    </div>
  );
};
