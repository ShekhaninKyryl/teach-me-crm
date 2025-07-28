import { _ } from 'translates/index';
import { SelectorInput } from 'components/common/selector/selector-input';
import { Input } from 'components/common/input';
import { Button } from 'components/common/button';
import { useFilter } from 'hooks/useFilter';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

type FilterTutorsProps = {};

export const FilterTutors = ({}: FilterTutorsProps) => {
  const { filter, setFilter, subjects, cities, selected, removeSelected, addSelected } =
    useFilter();

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
        addSelected('subject', subject.id, subject.icon);
      }
    }
  };

  const handleCityChange = (value: string | undefined) => {
    if (value) {
      addSelected('city', value);
    }
  };

  const handleFormatChange = (format: 'online' | 'offline') => {
    // Remove existing format selection if it exists
    const existing = selected.find((s) => s.type === 'format');
    if (existing) removeSelected(existing.value);
    addSelected('format', format);
    setFilter((prev) => ({ ...prev, format: format }));
  };

  console.log(filter, selected, cities);

  return (
    <div className="mx-auto py-4 px-4 bg-surface">
      <h2 className="text-xl font-bold text-text mb-6">{_('Filters')}</h2>

      {/*TODO: Chcklets*/}
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
          title={_('Search')}
          className="min-w-24 bg-primary text-text hover:bg-primary-hover"
          onClick={handleSearchAdd}
        />
      </div>

      <div className="flex flex-col gap-4 mb-8">
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
        {/* Format of Classes Selector
         TODO: Implement better UI for format selection
         */}
        <div className="grid grid-cols-2 gap-2">
          <Button title={_('Online')} onClick={() => handleFormatChange('online')} />
          <Button title={_('Offline')} onClick={() => handleFormatChange('offline')} />
        </div>
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
