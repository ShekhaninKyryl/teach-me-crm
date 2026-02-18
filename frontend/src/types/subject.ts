import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { Subject as SubjectType } from "@shared/types/subject";

export type Subject = SubjectType & {
  faIcon?: IconProp;
};
