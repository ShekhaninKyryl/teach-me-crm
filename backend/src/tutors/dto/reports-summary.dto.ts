import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from "class-validator";
import type { ReportsSummaryResponse } from "@shared/types/reports";

export { ReportsSummaryResponse };

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
