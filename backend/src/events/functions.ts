import { Prisma, EventStatus } from "@prisma/client";
import { EventDto } from "./dto/events.dto";
import { BadRequestException } from "@nestjs/common";

export function buildUpdateData(e: EventDto): Prisma.EventUpdateInput {
  const data: Prisma.EventUpdateInput = {};

  data.title = e.title.trim();

  if (typeof e.description === "string")
    data.description = e.description.trim();
  if (e.description === (null as any)) data.description = null;

  if (typeof e.weekly === "boolean") data.weekly = e.weekly;

  if (typeof e.price === "number") data.price = e.price;
  if (e.price === (null as any)) data.price = null;

  if (e.timeRange) {
    const { startAt, endAt } = mapTimeRange(e.timeRange);
    data.startAt = startAt;
    data.endAt = endAt;
  }

  data.student = { connect: { id: e.studentId } };

  if (typeof e.status === "string")
    data.status = e.status as unknown as EventStatus;

  return data;
}

export function mapTimeRange(timeRange?: {
  start: Date | string;
  end: Date | string;
}) {
  if (!timeRange) {
    return {
      startAt: undefined as Date | undefined,
      endAt: undefined as Date | undefined,
    };
  }

  const startAt = timeRange.start ? new Date(timeRange.start) : undefined;
  const endAt = timeRange.end ? new Date(timeRange.end) : undefined;

  if (startAt && Number.isNaN(startAt.getTime())) {
    throw new BadRequestException("timeRange.start should be valid Date");
  }
  if (endAt && Number.isNaN(endAt.getTime())) {
    throw new BadRequestException("timeRange.end should be valid Date");
  }
  if (startAt && endAt && startAt > endAt) {
    throw new BadRequestException("start date should be before end date");
  }

  return { startAt, endAt };
}
