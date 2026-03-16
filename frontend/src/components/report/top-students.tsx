import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { _ } from "@/translates";
import type { ReportsSummaryResponse } from "@shared/types/reports";

type Props = {
  students: ReportsSummaryResponse["charts"]["topStudents"];
};

export const TopStudents = ({ students }: Props) => {
  if (students.length === 0) return null;

  const maxLessons = Math.max(...students.map((s) => s.lessons), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{_("reports.top_students")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {students.map((student, index) => (
            <div key={student.studentId} className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm w-5 text-right shrink-0">
                {index + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium truncate">{student.studentName}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-3">
                    {student.lessons} {_("reports.lessons")} · {student.revenue} ₴
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(student.lessons / maxLessons) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

