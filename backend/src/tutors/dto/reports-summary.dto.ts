import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

export enum ReportsPeriodType {
  Week = "week",
  Month = "month",
}

export class GetTutorReportsSummaryQueryDto {
  @IsOptional()
  @IsEnum(ReportsPeriodType)
  periodType?: ReportsPeriodType;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  topStudentsLimit?: number;
}

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
      label: string;
      total: number;
      completed: number;
      pending: number;
    }[];
    revenueOverTime: {
      label: string;
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
