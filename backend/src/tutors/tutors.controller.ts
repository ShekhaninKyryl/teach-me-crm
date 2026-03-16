import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { TutorsService } from "./tutors.service";
import { TutorReportsService } from "./tutor-reports.service";
import { CreateTutorDto } from "./dto/create-tutor.dto";
import { UpdateTutorDto } from "./dto/update-tutor.dto";
import { CreateStudentAsUserDto } from "./dto/student-as-user.dto";
import { Filter } from "@shared/types/filter";
import { AuthGuard } from "../auth/auth.guard";
import { setAccessTokenCookie } from "src/auth/cookies";
import { type Request, type Response } from "express";
import { CreateAvatarPresignDto } from "src/tutors/dto/create-avatar-presign.dto";
import { JwtPayload } from "src/auth/types/jst";
import { GetTutorReportsSummaryQueryDto } from "src/tutors/dto/reports-summary.dto";

@Controller("tutors")
export class TutorsController {
  constructor(
    private readonly tutors: TutorsService,
    private readonly tutorReports: TutorReportsService,
  ) {}

  @Get("top")
  getTopTutors() {
    return this.tutors.getTopTutors();
  }

  @Post("search")
  search(@Body() filters: Filter[]) {
    return this.tutors.searchTutors(filters);
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  getTutorById(@Param("id") id: string) {
    return this.tutors.getTutorById(id);
  }

  @UseGuards(AuthGuard)
  @Get(":id/students")
  getTutorsStudents(@Param("id") userId: string) {
    return this.tutors.getTutorsStudents(userId);
  }

  @UseGuards(AuthGuard)
  @Put(":id/students")
  saveTutorsStudents(
    @Param("id") userId: string,
    @Body() students: CreateStudentAsUserDto[],
  ) {
    return this.tutors.saveTutorsStudents(userId, students);
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  updateTutorProfile(
    @Param("id") tutorId: string,
    @Body() dto: UpdateTutorDto,
  ) {
    return this.tutors.updateTutorProfile(tutorId, dto);
  }

  @UseGuards(AuthGuard)
  @Post(":id/avatar/presign")
  createAvatarUploadUrl(
    @Param("id") tutorId: string,
    @Body() dto: CreateAvatarPresignDto,
    @Req() req: Request & { user?: JwtPayload },
  ) {
    if (req.user?.id !== tutorId) {
      throw new ForbiddenException("Cannot upload avatar for another user");
    }

    return this.tutors.createAvatarUploadUrl(tutorId, dto);
  }

  @Post()
  async createTutorProfile(
    @Body() dto: CreateTutorDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, userId } = await this.tutors.createTutorProfile(dto);
    setAccessTokenCookie(res, access_token);
    return { success: true, userId };
  }

  @UseGuards(AuthGuard)
  @Get(":id/max-students")
  async getMaxStudents(@Param("id") tutorId: string) {
    return this.tutors.getMaxStudents(tutorId);
  }

  @UseGuards(AuthGuard)
  @Patch(":id/max-students")
  async updateMaxStudents(
    @Param("id") tutorId: string,
    @Body("maxStudents") maxStudents: number,
  ) {
    return this.tutors.updateMaxStudents(tutorId, maxStudents);
  }

  @UseGuards(AuthGuard)
  @Get(":id/reports/summary")
  async getReportsSummary(
    @Param("id") tutorId: string,
    @Query() query: GetTutorReportsSummaryQueryDto,
    @Req() req: Request & { user?: JwtPayload },
  ) {
    if (req.user?.id !== tutorId) {
      throw new ForbiddenException("Cannot view reports for another user");
    }

    return this.tutorReports.getSummary(tutorId, query);
  }
}
