import { useState } from 'react';

export type SortDirection = 'asc' | 'desc' | 'none';
type SortList = {
  [key: string]: SortDirection;
};

export const useSort = <T>(sortKeys: string[]) => {
  const [sortList, setSortList] = useState<SortList>(
    sortKeys.reduce<SortList>((acc, key) => {
      acc[key] = 'asc';
      return acc;
    }, {})
  );
  const [sortedData, setSortedData] = useState<T[]>([]);

  const sortData = (data: T[], key: string) => {
    const currentDirection = sortList[key];
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    const sorted = [...data].sort((a, b) => {
      if (a[key as keyof T] < b[key as keyof T]) return newDirection === 'asc' ? -1 : 1;
      if (a[key as keyof T] > b[key as keyof T]) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });
    const newSortList: SortList = Object.fromEntries(
      Object.keys(sortList).map((k) => [k, k === key ? newDirection : 'none'])
    );
    setSortList(newSortList);
    setSortedData(sorted);
  };

  return { sortedData, sortList, sortData };
};
