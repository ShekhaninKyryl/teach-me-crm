import { Injectable, Logger } from "@nestjs/common";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { ConfigService } from "@nestjs/config";
import { SendEmailNotificationInput } from "./email-notifications.types";

@Injectable()
export class EmailNotificationsService {
  private readonly logger = new Logger(EmailNotificationsService.name);
  private client: SESv2Client | null = null;

  constructor(private readonly configService: ConfigService) {}

  private isEmailEnabled(): boolean {
    return this.configService.get<string>("EMAIL_ENABLED") === "true";
  }

  private getClient(): SESv2Client {
    if (!this.client) {
      const region = this.configService.getOrThrow<string>("AWS_REGION");
      const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
      const secretAccessKey = this.configService.get<string>(
        "AWS_SECRET_ACCESS_KEY",
      );

      if (Boolean(accessKeyId) !== Boolean(secretAccessKey)) {
        this.logger.warn(
          "Only one of AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY is set. " +
            "Provide both for explicit credentials or neither to use the default credential provider chain.",
        );
      }

      this.client = new SESv2Client({
        region,
        ...(accessKeyId && secretAccessKey
          ? { credentials: { accessKeyId, secretAccessKey } }
          : {}),
      });
    }
    return this.client;
  }

  async sendEmail(params: SendEmailNotificationInput): Promise<void> {
    if (!this.isEmailEnabled()) {
      this.logger.warn(
        `Email sending is disabled (EMAIL_ENABLED is not "true"). Skipping email to ${params.to}.`,
      );
      return;
    }

    const fromEmail = this.configService.getOrThrow<string>("NO_REPLY_EMAIL");

    const command = new SendEmailCommand({
      FromEmailAddress: fromEmail,
      Destination: {
        ToAddresses: [params.to],
      },
      ReplyToAddresses: params.replyTo ? [params.replyTo] : undefined,
      Content: {
        Simple: {
          Subject: {
            Data: params.subject,
          },
          Body: {
            Text: params.text
              ? {
                  Data: params.text,
                }
              : undefined,
            Html: {
              Data: params.html,
            },
          },
        },
      },
    });

    try {
      await this.getClient().send(command);
      this.logger.log(
        `Email sent to ${params.to} with subject "${params.subject}"`,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to send email to ${params.to}: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Failed to send email to ${params.to}: ${String(error)}`,
        );
      }
      throw error;
    }
  }
}
