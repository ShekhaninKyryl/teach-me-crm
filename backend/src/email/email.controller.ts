import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { CheckEmailDto } from "./dto/check-email.dto";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("check")
  checkEmailExisting(@Body() dto: CheckEmailDto): Promise<boolean> {
    return this.emailService.checkEmailExisting(dto.email);
  }
}
