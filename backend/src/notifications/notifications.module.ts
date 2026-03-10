import { Module } from "@nestjs/common";
import { EmailNotificationsModule } from "./email-notifications/email-notifications.module";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [EmailNotificationsModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
