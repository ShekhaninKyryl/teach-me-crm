import type {User} from "./user";

export type Student = User & {
    color?: string;
    userId?: string;
}