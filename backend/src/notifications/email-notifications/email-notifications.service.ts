import { Injectable, Logger } from "@nestjs/common";
import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { ConfigService } from "@nestjs/config";
import { SendEmailNotificationInput } from "./email-notifications.types";

@Injectable()
export class EmailNotificationsService {
  private readonly logger = new Logger(EmailNotificationsService.name);
  private readonly client: SESv2Client;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new SESv2Client({
      region: this.configService.getOrThrow<string>("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.getOrThrow<string>(
          "AWS_SECRET_ACCESS_KEY",
        ),
      },
    });
    this.fromEmail = this.configService.getOrThrow<string>("NO_REPLY_EMAIL");
  }

  async sendEmail(params: SendEmailNotificationInput): Promise<void> {
    const command = new SendEmailCommand({
      FromEmailAddress: this.fromEmail,
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
      await this.client.send(command);
      this.logger.log(
        `Email sent to ${params.to} with subject "${params.subject}"`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${params.to}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
