import { Table } from '@radix-ui/themes';
import { StudentsRow } from 'components/students-table/sturend-row';
import { type FC, useEffect, useState } from 'react';
import type { User } from 'types/user';
import tutors from 'api/tutors';
import { Loading } from 'components/common/loading';
import { _ } from '@/translates';
import { PrimaryButton } from 'components/common/button';
import { AddStudent } from 'components/students-table/add-student';
import { Progress } from 'components/ui/progress';

interface Props {
  maxStudents: number;
}

export const StudentsTable: FC<Props> = ({ maxStudents }) => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const progressValue = (students.length / maxStudents) * 100;

  useEffect(() => {
    setLoading(true);
    tutors
      .getTutorsStudents('some-tutor-id')
      .then((fetchedStudents) => {
        setStudents(fetchedStudents);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddStudent = (student: User) => {
    setStudents((prevStudents) => [...prevStudents, student]);
  };

  const handleRemoveStudent = (studentId: string) => {
    setStudents((prevStudents) => prevStudents.filter((student) => student.id !== studentId));
  };

  const handleSubmit = async (students: User[]) => {
    setLoading(true);
    try {
      await tutors.saveTutorsStudents('some-tutor-id', students);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Progress value={progressValue} className="rounded-b-none" />
      </div>
      <Table.Root variant="surface" className="rounded-t-none">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{_('Name')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{_('Email')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <div className="flex items-center justify-center h-full w-full col-span-4">
                  <Loading size={16} />
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            <>
              {students.map((student) => (
                <StudentsRow student={student} removeStudent={handleRemoveStudent} />
              ))}
              {students.length < maxStudents && (
                <Table.Row>
                  <Table.Cell colSpan={3} className="text-center">
                    <AddStudent onChange={handleAddStudent} />
                  </Table.Cell>
                </Table.Row>
              )}
            </>
          )}
        </Table.Body>
      </Table.Root>
      <div className="flex justify-end mt-4">
        <PrimaryButton
          disabled={loading}
          className="w-xs"
          title={_('Save')}
          onClick={() => handleSubmit(students)}
        />
      </div>
    </>
  );
};
