import type { EventsFilter, EventStatusType } from "@shared/types/event";
import type { User } from "@shared/types/user";
import { type FC } from "react";
import { _ } from "@/translates";
import { SelectorInput } from "components/common/selector/selector-input";
import { Badge } from "components/ui/badge";
import { X } from "lucide-react";
import { Separator } from "@radix-ui/themes";
import { Checkbox } from "components/ui/checkbox";
import { Field, FieldContent, FieldGroup, FieldLabel } from "components/ui/field";

type EventFilterProps = {
  students: User[];
  statuses: EventStatusType[];
  filter: EventsFilter;
  onChange: (filter: EventsFilter) => void;
};

export const EventFilter: FC<EventFilterProps> = ({ students, statuses, filter, onChange }) => {
  const studentsOptions = students
    .filter(({ id }) => !filter.studentIds.includes(id))
    .map((student) => ({
      label: student.name,
      value: student.id,
    }));
  const statusOptions = Object.values(statuses)
    .filter((status) => !filter.statuses.includes(status))
    .map((status) => ({
      label: _(status),
      value: status,
    }));

  const handleAddStudent = (selectedStudentIds: string) => {
    onChange({
      ...filter,
      studentIds: [...filter.studentIds, selectedStudentIds],
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    onChange({
      ...filter,
      studentIds: filter.studentIds.filter((id) => id !== studentId),
    });
  };

  const handleAddStatus = (selectedStatuses: string) => {
    onChange({
      ...filter,
      statuses: [...filter.statuses, selectedStatuses as EventStatusType],
    });
  };

  const handleRemoveStatus = (status: string) => {
    onChange({
      ...filter,
      statuses: filter.statuses.filter((s) => s !== status),
    });
  };

  const handleUpdateArchived = () => {
    onChange({
      ...filter,
      showArchived: !filter.showArchived,
    });
  };

  return (
    <div>
      <FieldGroup className="mb-2">
        <Field orientation="horizontal">
          <Checkbox
            id="show-archived"
            name="show-archived"
            checked={filter.showArchived}
            onClick={handleUpdateArchived}
          />
          <FieldContent>
            <FieldLabel htmlFor="show-archived">{_("Show Archived lessons")}</FieldLabel>
          </FieldContent>
        </Field>
      </FieldGroup>
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <div className="max-w-sm">
            <SelectorInput
              placeholder={_("Filter by students")}
              options={studentsOptions}
              onChange={handleAddStudent}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filter.studentIds.map((id) => (
              <Badge key={id}>
                {students.find((student) => student.id === id)?.name || id}
                <button
                  onClick={() => handleRemoveStudent(id)}
                  className="hover:text-secondary cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        <Separator orientation="vertical" className="h-auto" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="max-w-sm">
            <SelectorInput
              placeholder={_("Filter by status")}
              options={statusOptions}
              onChange={handleAddStatus}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filter.statuses.map((status) => (
              <Badge key={status}>
                {_(status)}
                <button
                  onClick={() => handleRemoveStatus(status)}
                  className="hover:text-secondary cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
