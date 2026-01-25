import { StudentsTable } from 'components/students-table';

export const Students = () => {
  return (
    <div>
      <StudentsTable maxStudents={10} />
    </div>
  );
};
