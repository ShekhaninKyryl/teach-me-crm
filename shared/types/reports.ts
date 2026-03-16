export type ReportsPeriodType = "week" | "month";

export type ReportsSummaryQuery = {
  periodType?: ReportsPeriodType;
  from?: string; // ISO date string YYYY-MM-DD
  to?: string;   // ISO date string YYYY-MM-DD
  topStudentsLimit?: number;
};

export type ReportsSummaryResponse = {
  period: {
    type: ReportsPeriodType;
    from: string;
    to: string;
  };
  metrics: {
    totalLessons: number;
    completedLessons: number;
    pendingLessons: number;
    cancelledLessons: number;
    totalRevenue: number;
    averageLessonPrice: number;
    totalStudents: number;
    totalHours: number;
  };
  charts: {
    lessonsOverTime: {
      label: string; // YYYY-MM-DD
      total: number;
      completed: number;
      pending: number;
    }[];
    revenueOverTime: {
      label: string; // YYYY-MM-DD
      revenue: number;
    }[];
    topStudents: {
      studentId: string;
      studentName: string;
      lessons: number;
      revenue: number;
    }[];
  };
};

