import { Module } from "@nestjs/common";
import { TutorsController } from "./tutors.controller";
import { TutorsService } from "./tutors.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [TutorsController],
  providers: [TutorsService],
  exports: [TutorsService],
})
export class TutorsModule {}
