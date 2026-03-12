import { Injectable } from "@nestjs/common";
import { EmailNotificationsService } from "./email-notifications/email-notifications.service";
import { buildResetPasswordEmailTemplate } from "./email-notifications/templates/reset-password.template";
import { buildWelcomeTutorEmailTemplate } from "./email-notifications/templates/welcome-tutor.template";

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

  async sendTutorWelcomeEmail(
    to: string,
    workspaceLink: string,
    userName?: string,
    language: string = "en",
  ): Promise<void> {
    const { subject, html, text } = buildWelcomeTutorEmailTemplate(
      workspaceLink,
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
