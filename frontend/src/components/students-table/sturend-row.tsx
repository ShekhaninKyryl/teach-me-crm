import { Popover, Table } from '@radix-ui/themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wheel } from '@uiw/react-color';
import { type FC, useState } from 'react';
import type { User } from 'types/user';
import { RemoveStudent } from 'components/students-table/remove-student';

interface Props {
  student: User;
  updateStudent: (student: User) => void;
  removeStudent: (studentId: string) => void;
}

export const StudentsRow: FC<Props> = ({ student, updateStudent, removeStudent }) => {
  const { color: initialColor, email, name, id } = student;
  const [hexColor, setHexColor] = useState<string>(initialColor || '');

  const handleChangeColor = (open: boolean) => {
    if (!open) updateStudent({ ...student, color: hexColor });
  };

  return (
    <Table.Row key={id} align="center">
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{email}</Table.Cell>

      <Table.Cell align="right">
        <div className="flex items-center gap-2 justify-end">
          <div style={{ backgroundColor: hexColor }} className="rounded-full w-12 h-4" />
          <Popover.Root onOpenChange={handleChangeColor}>
            <Popover.Trigger>
              <FontAwesomeIcon
                className="cursor-pointer hover:bg-primary/10 hover:text-chart-2 rounded p-2"
                icon="palette"
              />
            </Popover.Trigger>
            <Popover.Content>
              <Wheel color={hexColor || '#ffffff'} onChange={(color) => setHexColor(color.hex)} />
            </Popover.Content>
          </Popover.Root>
          <RemoveStudent student={student} onChange={removeStudent} />
        </div>
      </Table.Cell>
    </Table.Row>
  );
};
