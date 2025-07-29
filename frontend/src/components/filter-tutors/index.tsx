import { _ } from 'translates/index';
import { SelectorInput } from 'components/common/selector/selector-input';
import { Input } from 'components/common/input';
import { Button } from 'components/common/button';
import { useFilter } from 'hooks/useFilter';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Chiclet } from 'components/common/chiclet';
import { Loading } from 'components/common/loading';

type FilterTutorsProps = {};

export const FilterTutors = ({}: FilterTutorsProps) => {
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
  } = useFilter();

  const handleSearchChange = (value: string) => {
    setFilter((prev) => ({ ...prev, search: value }));
  };
  const handleSearchAdd = () => {
    if (filter.search) {
      addSelected('search', filter.search);
      setFilter((prev) => ({ ...prev, search: '' }));
    }
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
    if (existing) return;
    addSelected('format', format);
    setFilter((prev) => ({ ...prev, format: format }));
  };

  if (isLoading) {
    return (
      <div className="mx-auto py-4 px-4 bg-background-secondary">
        <h2 className="text-xl font-bold text-text mb-2">{_('Filters')}</h2>
        <Loading />
      </div>
    );
  }
  return (
    <div className="mx-auto py-4 px-4 bg-background-secondary">
      <h2 className="text-xl font-bold text-text mb-2">{_('Filters')}</h2>

      {/* Selected Filters */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map(({ value, icon }) => (
          <Chiclet label={value} icon={icon} onClose={() => removeSelected(value)} />
        ))}
      </div>

      <div className="flex gap-2 mb-4 items-end">
        <Input
          label={_("Searching by subject, tutor's name or location")}
          type="text"
          placeholder={_('Enter search term...')}
          className="w-full"
          onChange={handleSearchChange}
          value={filter.search || ''}
        />
        <Button
          disabled={filter.search === '' || Boolean(filter.search && findSelected(filter.search))}
          title={_('Search')}
          className="min-w-24"
          onClick={handleSearchAdd}
        />
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {/* Format of Classes Selector*/}
        <div className="grid grid-cols-2 gap-2">
          <Button
            title={_('Online')}
            disabled={Boolean(findSelected('online'))}
            onClick={() => handleFormatChange('online')}
          />
          <Button
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
      </div>
    </div>
  );
};
