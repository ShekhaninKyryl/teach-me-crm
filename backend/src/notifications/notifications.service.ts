import { Injectable } from "@nestjs/common";
import { EmailNotificationsService } from "./email-notifications/email-notifications.service";
import { buildResetPasswordEmailTemplate } from "./email-notifications/teamplates/reset-password.template";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailNotificationsService: EmailNotificationsService,
  ) {}

  async sendPasswordResetEmail(
    to: string,
    resetPasswordLink: string,
    userName?: string,
    language: string = "en",
  ): Promise<void> {
    const { subject, html, text } = buildResetPasswordEmailTemplate(
      resetPasswordLink,
      userName,
      language,
    );
    await this.emailNotificationsService.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }
}
