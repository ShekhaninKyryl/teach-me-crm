import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventStatus } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import {
  GetTutorReportsSummaryQueryDto,
  ReportsPeriodType,
  ReportsSummaryResponse,
} from "src/tutors/dto/reports-summary.dto";

const COMPLETED_STATUS_SET = new Set<EventStatus>([
  EventStatus.COMPLETED,
  EventStatus.PAID,
]);

const PENDING_STATUS_SET = new Set<EventStatus>([EventStatus.PENDING]);

@Injectable()
export class TutorReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(
    tutorId: string,
    query: GetTutorReportsSummaryQueryDto,
  ): Promise<ReportsSummaryResponse> {
    const periodType = query.periodType ?? ReportsPeriodType.Week;
    const topStudentsLimit = query.topStudentsLimit ?? 5;
    const { from, to } = this.resolvePeriod(periodType, query.from, query.to);

    const tutorExists = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorId },
      select: { userId: true },
    });

    if (!tutorExists) {
      throw new NotFoundException("Tutor not found");
    }

    const [events, totalStudents] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where: {
          tutorUserId: tutorId,
          startAt: { gte: from, lte: to },
        },
        select: {
          id: true,
          status: true,
          price: true,
          startAt: true,
          endAt: true,
          studentId: true,
          student: {
            select: {
              id: true,
              name: true,
              user: { select: { name: true } },
            },
          },
        },
      }),
      this.prisma.student.count({ where: { tutorUserId: tutorId } }),
    ]);

    const days = this.buildDayBuckets(from, to);

    const lessonBuckets = new Map<
      string,
      { total: number; completed: number; pending: number }
    >(days.map((d) => [d, { total: 0, completed: 0, pending: 0 }]));

    const revenueBuckets = new Map<string, number>(days.map((d) => [d, 0]));

    let completedLessons = 0;
    let pendingLessons = 0;
    let cancelledLessons = 0;
    let totalRevenue = 0;
    let totalHours = 0;

    const studentsMap = new Map<
      string,
      { studentName: string; lessons: number; revenue: number }
    >();

    for (const event of events) {
      if (!event.startAt) continue;

      const dayLabel = this.toIsoDay(event.startAt);
      const lessonBucket = lessonBuckets.get(dayLabel);

      if (lessonBucket) {
        lessonBucket.total += 1;
      }

      if (COMPLETED_STATUS_SET.has(event.status)) {
        completedLessons += 1;

        if (lessonBucket) {
          lessonBucket.completed += 1;
        }

        const eventRevenue = event.price ?? 0;
        totalRevenue += eventRevenue;

        if (revenueBuckets.has(dayLabel)) {
          revenueBuckets.set(
            dayLabel,
            (revenueBuckets.get(dayLabel) ?? 0) + eventRevenue,
          );
        }

        if (event.endAt && event.endAt > event.startAt) {
          totalHours +=
            (event.endAt.getTime() - event.startAt.getTime()) /
            (60 * 60 * 1000);
        }

        if (event.studentId) {
          const entry = studentsMap.get(event.studentId) ?? {
            studentName:
              event.student?.user?.name ??
              event.student?.name ??
              "Unknown student",
            lessons: 0,
            revenue: 0,
          };

          entry.lessons += 1;
          entry.revenue += eventRevenue;
          studentsMap.set(event.studentId, entry);
        }
      } else if (PENDING_STATUS_SET.has(event.status)) {
        pendingLessons += 1;

        if (lessonBucket) {
          lessonBucket.pending += 1;
        }
      } else if (
        event.status === EventStatus.CANCELLED ||
        event.status === EventStatus.RESCHEDULED
      ) {
        cancelledLessons += 1;
      }
    }

    const topStudents = Array.from(studentsMap.entries())
      .map(([studentId, value]) => ({
        studentId,
        studentName: value.studentName,
        lessons: value.lessons,
        revenue: value.revenue,
      }))
      .sort((a, b) =>
        b.lessons !== a.lessons ? b.lessons - a.lessons : b.revenue - a.revenue,
      )
      .slice(0, topStudentsLimit);

    return {
      period: {
        type: periodType,
        from: from.toISOString(),
        to: to.toISOString(),
      },
      metrics: {
        totalLessons: events.length,
        completedLessons,
        pendingLessons,
        cancelledLessons,
        totalRevenue,
        averageLessonPrice:
          completedLessons > 0
            ? Number((totalRevenue / completedLessons).toFixed(2))
            : 0,
        totalStudents,
        totalHours: Number(totalHours.toFixed(2)),
      },
      charts: {
        lessonsOverTime: days.map((label) => ({
          label,
          ...lessonBuckets.get(label)!,
        })),
        revenueOverTime: days.map((label) => ({
          label,
          revenue: revenueBuckets.get(label) ?? 0,
        })),
        topStudents,
      },
    };
  }

  private resolvePeriod(
    periodType: ReportsPeriodType,
    fromInput?: Date,
    toInput?: Date,
  ): { from: Date; to: Date } {
    const hasFrom = fromInput instanceof Date;
    const hasTo = toInput instanceof Date;

    if (hasFrom !== hasTo) {
      throw new BadRequestException("from and to must be provided together");
    }

    if (hasFrom && hasTo) {
      const from = this.startOfUtcDay(fromInput!);
      const to = this.endOfUtcDay(toInput!);

      if (from > to) {
        throw new BadRequestException("from must be before to");
      }

      return { from, to };
    }

    const now = new Date();

    if (periodType === ReportsPeriodType.Month) {
      return {
        from: new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
        ),
        to: new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          ),
        ),
      };
    }

    // Default: current ISO week (Mon–Sun)
    const todayStart = this.startOfUtcDay(now);
    const diffToMonday = (todayStart.getUTCDay() + 6) % 7;

    const from = new Date(todayStart);
    from.setUTCDate(todayStart.getUTCDate() - diffToMonday);

    const to = new Date(from);
    to.setUTCDate(from.getUTCDate() + 6);
    to.setUTCHours(23, 59, 59, 999);

    return { from, to };
  }

  private buildDayBuckets(from: Date, to: Date): string[] {
    const result: string[] = [];
    const current = this.startOfUtcDay(from);
    const end = this.startOfUtcDay(to);

    while (current <= end) {
      result.push(this.toIsoDay(current));
      current.setUTCDate(current.getUTCDate() + 1);
    }

    return result;
  }

  private toIsoDay(value: Date): string {
    return value.toISOString().slice(0, 10);
  }

  private startOfUtcDay(value: Date): Date {
    return new Date(
      Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
  }

  private endOfUtcDay(value: Date): Date {
    return new Date(
      Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
  }
}
