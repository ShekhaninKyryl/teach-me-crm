import { User } from "./user";
import { Format } from "./common";

export type Tutor = User & {
  subjects: string[];
  format: Format[];
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
