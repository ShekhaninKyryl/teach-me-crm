import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("check")
  checkEmailExisting(@Body() dto: { email: string }): Promise<boolean> {
    return this.emailService.checkEmailExisting(dto.email);
  }
}
