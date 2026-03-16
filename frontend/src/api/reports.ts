import axios from "./axios";
import { getConfig } from "@/configs";
import { withToast } from "api/with-toast";
import type {
  ReportsSummaryQuery,
  ReportsSummaryResponse,
} from "@shared/types/reports";

export interface ReportsApi {
  getTutorReportsSummary(
    tutorId: string,
    query?: ReportsSummaryQuery,
  ): Promise<ReportsSummaryResponse>;
}

const reportsApiMock: ReportsApi = {
  async getTutorReportsSummary(tutorId, query): Promise<ReportsSummaryResponse> {
    console.log("Mock getTutorReportsSummary", tutorId, query);
    return new Promise((resolve) =>
      setTimeout(() => {
        const today = new Date();
        const days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setUTCDate(today.getUTCDate() - 6 + i);
          return d.toISOString().slice(0, 10);
        });

        resolve({
          period: {
            type: query?.periodType ?? "week",
            from: days[0],
            to: days[6],
          },
          metrics: {
            totalLessons: 12,
            completedLessons: 8,
            pendingLessons: 3,
            cancelledLessons: 1,
            totalRevenue: 1200,
            averageLessonPrice: 150,
            totalStudents: 5,
            totalHours: 16,
          },
          charts: {
            lessonsOverTime: days.map((label, i) => ({
              label,
              total: i % 2 === 0 ? 2 : 1,
              completed: i % 2 === 0 ? 1 : 1,
              pending: i % 2 === 0 ? 1 : 0,
            })),
            revenueOverTime: days.map((label, i) => ({
              label,
              revenue: i % 2 === 0 ? 300 : 150,
            })),
            topStudents: [
              { studentId: "s1", studentName: "Alice", lessons: 4, revenue: 600 },
              { studentId: "s2", studentName: "Bob", lessons: 3, revenue: 450 },
              { studentId: "s3", studentName: "Charlie", lessons: 1, revenue: 150 },
            ],
          },
        });
      }, 600),
    );
  },
};

const reportsApi: ReportsApi = {
  async getTutorReportsSummary(tutorId, query): Promise<ReportsSummaryResponse> {
    const params: Record<string, string | number> = {};

    if (query?.periodType) params.periodType = query.periodType;
    if (query?.from) params.from = query.from;
    if (query?.to) params.to = query.to;
    if (query?.topStudentsLimit) params.topStudentsLimit = query.topStudentsLimit;

    const response = await axios.get<ReportsSummaryResponse>(
      `/tutors/${tutorId}/reports/summary`,
      { params },
    );

    return response.data;
  },
};

const api = getConfig().isMock ? reportsApiMock : withToast(reportsApi);
export default api;

