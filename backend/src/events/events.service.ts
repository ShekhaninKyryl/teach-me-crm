import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { EventStatusType, UpsertEventDto } from "./dto/events.dto";

function mapDbToApi(e: any) {
  return {
    id: e.id,
    tutorId: e.tutorUserId,
    studentId: e.studentId,
    title: e.title,
    description: e.description ?? undefined,
    timeRange:
      e.startAt && e.endAt ? { start: e.startAt, end: e.endAt } : undefined,
    weekly: e.weekly ?? false,
    status: e.status as EventStatusType,
    price: e.price ?? undefined,
  };
}

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTutorEvents(tutorUserId: string) {
    const items = await this.prisma.event.findMany({
      where: { tutorUserId },
      orderBy: { startAt: "asc" },
    });

    return items.map(mapDbToApi);
  }

  async upsertMany(events: UpsertEventDto[]) {
    if (!Array.isArray(events)) {
      throw new BadRequestException("Body must be an array of events");
    }

    for (const e of events) {
      const start = e.timeRange?.start;
      const end = e.timeRange?.end;
      if (start && end && start > end) {
        throw new BadRequestException(
          `Invalid timeRange for event ${e.id}: start > end`,
        );
      }
    }

    await this.prisma.$transaction(
      events.map((e) => {
        const startAt = e.timeRange?.start ?? null;
        const endAt = e.timeRange?.end ?? null;

        return this.prisma.event.upsert({
          where: { id: e.id },
          create: {
            id: e.id,
            tutorUserId: e.tutorId,
            studentId: e.studentId,
            title: e.title,
            description: e.description ?? null,
            startAt,
            endAt,
            weekly: e.weekly ?? false,
            status: e.status as any,
            price: e.price ?? null,
          },
          update: {
            tutorUserId: e.tutorId,
            studentId: e.studentId,
            title: e.title,
            description: e.description ?? null,
            startAt,
            endAt,
            weekly: e.weekly ?? false,
            status: e.status as any,
            price: e.price ?? null,
          },
        });
      }),
    );
  }

  async syncTutorEvents(tutorUserId: string, events: UpsertEventDto[]) {
    const incomingIds = new Set(events.map((e) => e.id));

    await this.prisma.$transaction(async (tx) => {
      await tx.event.deleteMany({
        where: {
          tutorUserId,
          id: { notIn: Array.from(incomingIds) },
        },
      });

      for (const e of events) {
        const startAt = e.timeRange?.start ?? null;
        const endAt = e.timeRange?.end ?? null;

        await tx.event.upsert({
          where: { id: e.id },
          create: {
            id: e.id,
            tutorUserId: e.tutorId,
            studentId: e.studentId,
            title: e.title,
            description: e.description ?? null,
            startAt,
            endAt,
            weekly: e.weekly ?? false,
            status: e.status as any,
            price: e.price ?? null,
          },
          update: {
            tutorUserId: e.tutorId,
            studentId: e.studentId,
            title: e.title,
            description: e.description ?? null,
            startAt,
            endAt,
            weekly: e.weekly ?? false,
            status: e.status as any,
            price: e.price ?? null,
          },
        });
      }
    });
  }
}
