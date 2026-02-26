import type {User} from "./user";
import type {Format} from "./common";

export type Tutor = User & {
  subjects: string[];
  formats: Format[];
  rating: number;
  price: number;
  location?: string;
  bio?: string;
  availability: string[];
  maxStudents?: number;
};

export type TutorWithPassword = Tutor & {
  password: string;
  currentPassword: string;
};
