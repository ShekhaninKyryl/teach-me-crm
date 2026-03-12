import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { EventStatusType, EventDto } from "./dto/events.dto";
import { buildUpdateData, mapTimeRange } from "src/events/functions";

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

  async createEvents(events: EventDto[]) {
    if (!Array.isArray(events) || events.length === 0) return;

    if (events.length === 0) return;

    const data: Prisma.EventCreateManyInput[] = events.map((e) => {
      if (!e.timeRange) {
        throw new BadRequestException("start and end date are required");
      }

      if (!e.tutorId || !e.studentId) {
        throw new BadRequestException("tutorId and studentId is required");
      }
      if (!e.title?.trim()) {
        throw new BadRequestException("title is required");
      }

      const { startAt, endAt } = mapTimeRange(e.timeRange);

      return {
        tutorUserId: e.tutorId,
        studentId: e.studentId,
        title: e.title.trim(),
        description: e.description?.trim() ?? null,
        startAt,
        endAt,

        weekly: e.weekly ?? false,
        status: e.status,
        price: e.price ?? null,
      };
    });

    await this.prisma.event.createMany({
      data,
    });
  }

  async updateEvents(events: EventDto[]) {
    if (!Array.isArray(events) || events.length === 0) return;

    const missingId = events.find((e) => !e.id);
    if (missingId) {
      throw new BadRequestException("Event Id was not find");
    }

    await this.prisma.$transaction(
      events.map((e) => {
        const data = buildUpdateData(e);

        if (Object.keys(data).length === 0) {
          return this.prisma.event.findUnique({ where: { id: e.id } });
        }

        return this.prisma.event.update({
          where: { id: e.id },
          data,
        });
      }),
    );
  }

  async deleteEvent(eventId: string) {
    if (!eventId) throw new BadRequestException("eventId is required");

    try {
      await this.prisma.event.delete({ where: { id: eventId } });
    } catch (err: any) {
      if (err?.code === "P2025") {
        throw new NotFoundException("Event not found");
      }
      throw err;
    }
  }
}
