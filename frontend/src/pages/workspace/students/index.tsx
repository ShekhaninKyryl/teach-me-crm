import { StudentsTable } from 'components/students-table';
import { MaxStudentsForm } from 'components/max-students-form';
import { FREE_STUDENTS_CAPACITY_LIMIT } from '@/constants';
import { Blockquote, Separator } from '@radix-ui/themes';
import { _ } from '@/translates';
import { useState } from 'react';

export const Students = () => {
  const [maxStudents, setMaxStudents] = useState<number>(FREE_STUDENTS_CAPACITY_LIMIT + 2);
  return (
    <div className="flex flex-col gap-4">
      <Blockquote className="text-justify">{_('students_page.capacity')}</Blockquote>
      <MaxStudentsForm
        maxStudents={maxStudents}
        onSubmit={({ maxStudents }) => setMaxStudents(maxStudents)}
      />
      <Separator className="w-full" />
      <Blockquote className="text-justify">{_('students_page.table')}</Blockquote>
      <StudentsTable maxStudents={maxStudents} />
    </div>
  );
};
