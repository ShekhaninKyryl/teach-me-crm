import { Module } from "@nestjs/common";
import { EmailNotificationsService } from "./email-notifications.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [EmailNotificationsService],
  exports: [EmailNotificationsService],
})
export class EmailNotificationsModule {}
