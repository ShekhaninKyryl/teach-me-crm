import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator";

export enum EventStatusType {
  Pending = "PENDING",
  Rescheduled = "RESCHEDULED",
  Cancelled = "CANCELLED",
  Completed = "COMPLETED",
  Paid = "PAID",
}

export class TimeRangeDto {
  @Type(() => Date)
  start!: Date;

  @Type(() => Date)
  end!: Date;
}

export class EventDto {
  @IsUUID()
  id!: string;

  @IsString()
  tutorId!: string;

  @IsUUID()
  studentId!: string;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TimeRangeDto)
  timeRange?: TimeRangeDto;

  @IsOptional()
  @IsBoolean()
  weekly?: boolean;

  @IsEnum(EventStatusType)
  status!: EventStatusType;

  @IsOptional()
  @IsInt()
  price?: number;
}
