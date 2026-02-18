import type { Contact } from "@shared/types/contacts";

export type User = Contact & {
  id: string;
  name: string;
  email?: string;
  color?: string;
  avatar?: string;
};
