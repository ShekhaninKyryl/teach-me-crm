import { useState } from 'react';
import { Input } from 'components/common/input';
import { _ } from 'translates/index';
import { Button } from 'components/common/button';
import { Selector } from 'components/common/selector';

export const FindTutor = () => {
  const [search, setSearch] = useState('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    //TODO: Implement search functionality
  };

  return (
    <div className="mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-text mb-6">{_('Find tutor')}</h1>

      <div className="flex gap-2 mb-6 items-end">
        <Input
          className="min-w-1/2"
          label={_("Searching by subject, tutor's name or location")}
          type="test"
          onChange={handleSearchChange}
        />
        <Button className="min-w-24" title={_('Search')} onClick={handleSearchSubmit} />
      </div>

      {/* Фільтри */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Selector
          placeholder={_('Select subject')}
          options={[
            { value: 'math', label: _('Math'), icon: 'calculator' },
            { value: 'english', label: _('English'), icon: 'language' },
            { value: 'history', label: _('History'), icon: 'history' },
            { value: 'biology', label: _('Biology'), icon: 'dna' },
            { value: 'chemistry', label: _('Chemistry'), icon: 'flask' },
            { value: 'literature', label: _('Literature'), icon: 'book' },
            { value: 'geography', label: _('Geography'), icon: 'globe' },
            { value: 'computer-science', label: _('Computer Science'), icon: 'laptop-code' },
            { value: 'art', label: _('Art'), icon: 'palette' },
            { value: 'music', label: _('Music'), icon: 'music' },
            { value: 'physics', label: _('Physics'), icon: 'atom' },
          ]}
          value={'math'}
          onChange={(value) => {
            //TODO: Implement subject selection
          }}
        />
        <Selector
          placeholder={_('Format of classes')}
          options={[
            { value: 'online', label: _('Online'), icon: 'laptop' },
            { value: 'offline', label: _('Offline'), icon: 'map-marker-alt' },
          ]}
          value={'online'}
          onChange={(value) => {
            //TODO: Implement format selection
          }}
        />
        <Selector
          placeholder={_('City')}
          options={[
            { value: 'kyiv', label: _('Kyiv') },
            { value: 'kharkiv', label: _('Kharkiv') },
            { value: 'odessa', label: _('Odessa') },
            { value: 'lviv', label: _('Lviv') },
            { value: 'dnipro', label: _('Dnipro') },
            { value: 'zaporizhzhia', label: _('Zaporizhzhia') },
          ]}
          value={'kyiv'}
          onChange={(value) => {
            //TODO: Implement city selection
          }}
        />
      </div>

      {/* Результати пошуку (тимчасово заглушки) */}
      <div className="space-y-4">
        {[1, 2, 3].map((id) => (
          <div
            key={id}
            className="border border-border rounded p-4 shadow-sm bg-surface hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-text">Імʼя репетитора</h2>
            <p className="text-text-secondary">Предмет: Математика</p>
            <p className="text-text-secondary">Формат: Онлайн</p>
            <p className="text-text-secondary">Місто: Київ</p>
          </div>
        ))}
      </div>
    </div>
  );
};
