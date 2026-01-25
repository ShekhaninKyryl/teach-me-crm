import { type FC } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from 'components/ui/dialog';
import { ErrorButton } from 'components/common/button';
import { _ } from '@/translates';
import type { User } from 'types/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RemoveStudentProps {
  student: User;
  onChange: (studentId: string) => void;
}

export const RemoveStudent: FC<RemoveStudentProps> = ({ student, onChange }) => {
  const handleRemove = () => {
    onChange(student.id);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <FontAwesomeIcon
          icon="xmark"
          className="cursor-pointer hover:bg-primary/10 hover:text-destructive rounded p-2"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{_('Remove Student - {NAME}', { NAME: student.name })}</DialogTitle>
        <div>{_('Are you sure you want to remove this student?')}</div>
        <DialogClose>
          <ErrorButton className="w-full" title={_('Remove')} onClick={handleRemove} />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
