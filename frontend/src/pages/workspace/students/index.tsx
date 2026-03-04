import { StudentsTable } from "components/students-table";
import { MaxStudentsForm } from "components/max-students-form";
import { FREE_STUDENTS_CAPACITY_LIMIT } from "@/constants";
import { Blockquote, Separator } from "@radix-ui/themes";
import { _ } from "@/translates";
import { useEffect, useState } from "react";
import tutorApi from "@/api/tutors";
import { useAuth } from "@/contexts/auth-context";
import { Loading } from "components/common/loading";

export const StudentsPage = () => {
  const { user } = useAuth();
  const [maxStudents, setMaxStudents] = useState<number>(FREE_STUDENTS_CAPACITY_LIMIT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    tutorApi
      .getStudentsCount(user?.id)
      .then((maxStudents) => {
        setMaxStudents(maxStudents);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleMaxStudentsUpdate = (newMax: number) => {
    if (!user) return;

    setLoading(true);
    tutorApi
      .setMaxStudents(user.id, newMax)
      .then(() => {
        setMaxStudents(newMax);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <Loading size={16} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Blockquote className="text-justify">{_("students_page.capacity")}</Blockquote>
      <MaxStudentsForm maxStudents={maxStudents} onSubmit={handleMaxStudentsUpdate} />
      <Separator className="w-full" />
      <Blockquote className="text-justify">{_("students_page.table")}</Blockquote>
      <StudentsTable maxStudents={maxStudents} />
    </div>
  );
};
