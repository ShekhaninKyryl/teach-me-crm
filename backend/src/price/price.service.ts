import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class PriceService {
  constructor(private readonly prisma: PrismaService) {}

  async getPriceRange(): Promise<number[]> {
    const agg = await this.prisma.tutorProfile.aggregate({
      _min: { price: true },
      _max: { price: true },
    });

    return [agg._min.price ?? 0, agg._max.price ?? 0];
  }
}
