import type {Contact} from "./contacts";

export type User = Contact & {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
};
