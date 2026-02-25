import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCities(): Promise<string[]> {
    const rows = await this.prisma.tutorProfile.findMany({
      distinct: ["location"],
      select: { location: true },
      where: { location: { not: null } },
      orderBy: { location: "asc" },
    });

    return rows.map((r) => r.location!).filter(Boolean);
  }
}
