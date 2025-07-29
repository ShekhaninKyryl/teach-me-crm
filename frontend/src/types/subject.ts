import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export type Subject = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  faIcon?: IconProp;
};
