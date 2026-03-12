export type SendEmailNotificationInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};
