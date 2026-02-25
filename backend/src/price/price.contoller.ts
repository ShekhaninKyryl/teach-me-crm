import { Controller, Get } from "@nestjs/common";
import { PriceService } from "./price.service";

@Controller("price")
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get("range")
  getPriceRange(): Promise<number[]> {
    return this.priceService.getPriceRange();
  }
}
