import type { User } from 'types/user';
import type { Format } from 'types/common';

export type Tutor = User & {
  subjects: string[];
  format: Format;
  rating: number;
  pricePerHour: number;
  location?: string;
  bio?: string;
  profilePictureUrl?: string;
};
