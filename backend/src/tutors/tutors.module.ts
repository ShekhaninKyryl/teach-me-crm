import { Module } from "@nestjs/common";
import { TutorsController } from "./tutors.controller";
import { TutorsService } from "./tutors.service";
import { TutorReportsService } from "./tutor-reports.service";
import { AuthModule } from "src/auth/auth.module";
import { NotificationsModule } from "src/notifications/notifications.module";
import { StorageModule } from "src/storage/storage.module";

@Module({
  imports: [AuthModule, NotificationsModule, StorageModule],
  controllers: [TutorsController],
  providers: [TutorsService, TutorReportsService],
  exports: [TutorsService, TutorReportsService],
})
export class TutorsModule {}
