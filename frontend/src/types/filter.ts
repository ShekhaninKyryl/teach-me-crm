export type FilterType = 'subject' | 'format' | 'city' | 'search';

export type Filter = {
  value: string;
  type: FilterType;
};
