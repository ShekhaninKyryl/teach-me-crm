export type FilterType = 'subject' | 'format' | 'city' | 'search' | 'price' | 'available';

export type Filter = {
  value: string;
  type: FilterType;
};
