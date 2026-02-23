import { Body, Controller, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { TutorsService } from "./tutors.service";
import { CreateTutorDto } from "./dto/create-tutor.dto";
import { UpdateTutorDto } from "./dto/update-tutor.dto";
import {Filter} from "@shared/types/filter";

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

    @Get(":id")
    getTutorById(@Param("id") id: string) {
        return this.tutors.getTutorById(id);
    }

    @Get(":id/students")
    getTutorsStudents(@Param("id") tutorId: string) {
        return this.tutors.getTutorsStudents(tutorId);
    }

    @Put(":id/students")
    saveTutorsStudents(@Param("id") tutorId: string, @Body() students: any[]) {
        return this.tutors.saveTutorsStudents(tutorId, students);
    }

    @Patch(":id")
    updateTutorProfile(@Param("id") tutorId: string, @Body() dto: UpdateTutorDto) {
        return this.tutors.updateTutorProfile(tutorId, dto);
    }

    @Post()
    createTutorProfile(@Body() dto: CreateTutorDto) {
        return this.tutors.createTutorProfile(dto);
    }
}