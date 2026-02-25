import { Module } from "@nestjs/common";
import { PriceController } from "./price.contoller";
import { PriceService } from "./price.service";

@Module({
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
