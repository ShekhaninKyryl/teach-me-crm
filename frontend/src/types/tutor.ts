import type { User } from 'types/user';
import type { Format } from 'types/common';

export type Tutor = User & {
  subjects: string[];
  format: Format[];
  rating: number;
  price: number;
  location?: string;
  bio?: string;
  avatar?: string;
  availability: string[];
  maxStudents?: number;
};
