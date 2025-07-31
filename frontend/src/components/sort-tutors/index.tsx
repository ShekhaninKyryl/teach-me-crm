import { _ } from 'translates/index';
import { TypedButton } from 'components/common/button';
import type { SortDirection } from 'hooks/useSort';
import { Loading } from 'components/common/loading';

type SortTutorsProps = {
  onSortChange?: (sortBy: string) => void;
  ratingSort: SortDirection;
  priceSort: SortDirection;
  isLoading?: boolean;
};

export const SortTutors = ({ ratingSort, priceSort, onSortChange, isLoading }: SortTutorsProps) => {
  const getSortIcon = (sortDirection: SortDirection) => {
    switch (sortDirection) {
      case 'asc':
        return 'sort-amount-desc';
      case 'desc':
        return 'sort-amount-asc';
      default:
        return 'arrows-v';
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto py-4 px-4 mb-2 bg-background-secondary">
        <h2 className="text-xl font-bold text-text mb-2">{_('Sort by')}</h2>
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative mx-auto py-4 px-4 mb-2 bg-background-secondary">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text mb-2">{_('Sort by')}</h2>
      </div>

      <div className="flex justify-center gap-2">
        <TypedButton
          variant={ratingSort === 'none' ? 'transparent' : 'accent'}
          icon={getSortIcon(ratingSort)}
          iconPosition="right"
          title={_('Rating')}
          className="w-full"
          onClick={() => onSortChange?.('rating')}
        />
        <TypedButton
          variant={priceSort === 'none' ? 'transparent' : 'accent'}
          icon={getSortIcon(priceSort)}
          iconPosition="right"
          title={_('Price')}
          className="w-full"
          onClick={() => onSortChange?.('price')}
        />
      </div>
    </div>
  );
};
