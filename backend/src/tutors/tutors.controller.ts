import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
} from "@nestjs/common";
import { TutorsService } from "./tutors.service";
import { CreateTutorDto } from "./dto/create-tutor.dto";
import { UpdateTutorDto } from "./dto/update-tutor.dto";
import { Filter } from "@shared/types/filter";
import { AuthGuard } from "../auth/auth.guard";
import { setAccessTokenCookie } from "src/auth/cookies";
import { type Response } from "express";

@Controller("tutors")
export class TutorsController {
  constructor(private readonly tutors: TutorsService) {}

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
  getTutorsStudents(@Param("id") tutorId: string) {
    return this.tutors.getTutorsStudents(tutorId);
  }

  @UseGuards(AuthGuard)
  @Put(":id/students")
  saveTutorsStudents(@Param("id") tutorId: string, @Body() students: any[]) {
    return this.tutors.saveTutorsStudents(tutorId, students);
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  updateTutorProfile(
    @Param("id") tutorId: string,
    @Body() dto: UpdateTutorDto,
  ) {
    return this.tutors.updateTutorProfile(tutorId, dto);
  }

  @Post()
  async createTutorProfile(
    @Body() dto: CreateTutorDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.tutors.createTutorProfile(dto);
    setAccessTokenCookie(res, access_token);
    return { success: true };
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
}
