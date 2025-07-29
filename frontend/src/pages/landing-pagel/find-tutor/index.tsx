import { _ } from 'translates/index';
import { FilterTutors } from 'components/filter-tutors';

export const FindTutor = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-text mb-2">{_('Find tutor')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="md:col-span-2">
          <FilterTutors />
        </div>

        <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((id) => (
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
    </>
  );
};
