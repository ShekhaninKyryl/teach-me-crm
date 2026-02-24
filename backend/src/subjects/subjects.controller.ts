import { Controller, Get } from "@nestjs/common";
import { SubjectsService } from "./subjects.service";
import { Subject } from "@prisma/client";

@Controller("subjects")
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  getSubjects(): Promise<Subject[]> {
    return this.subjectsService.getSubjects();
  }
}
