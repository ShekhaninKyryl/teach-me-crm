import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { Subject } from "@prisma/client";

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubjects(): Promise<Subject[]> {
    return this.prisma.subject.findMany({
      orderBy: { label: "asc" },
    });
  }
}
