import { _ } from '@/translates';
import type { SortDirection } from 'hooks/useSort';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import React from 'react';
import classNames from 'classnames';

type SortTutorsProps = {
  onSortChange?: (sortBy: string) => void;
  ratingSort: SortDirection;
  priceSort: SortDirection;
  isLoading?: boolean;
};

export const SortTutorsComponent = ({
  ratingSort,
  priceSort,
  onSortChange,
  isLoading,
}: SortTutorsProps) => {
  const getSortIcon = (sortDirection: SortDirection) => {
    switch (sortDirection) {
      case 'desc':
        return <ArrowUp className="w-4 h-4 ml-2" />;
      case 'asc':
        return <ArrowDown className="w-4 h-4 ml-2" />;
      default:
        return <ArrowUpDown className="w-4 h-4 ml-2 opacity-50" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="py-4 px-4 mb-2">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-xl font-bold">{_('Sort by')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{_('Sort by')}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          variant={ratingSort === 'none' ? 'outline' : 'default'}
          className={classNames('rounded-r-none', ratingSort === 'none' ? '' : 'flex-1')}
          onClick={() => onSortChange?.('rating')}
        >
          {_('by Rating')}
          {getSortIcon(ratingSort)}
        </Button>
        <Button
          variant={priceSort === 'none' ? 'outline' : 'default'}
          className={classNames('rounded-l-none', priceSort === 'none' ? '' : 'flex-1')}
          onClick={() => onSortChange?.('price')}
        >
          {_('by Price')}
          {getSortIcon(priceSort)}
        </Button>
      </CardContent>
    </Card>
  );
};

const SortTutors = React.memo(SortTutorsComponent);

export default SortTutors;
