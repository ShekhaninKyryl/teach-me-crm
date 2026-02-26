import { Body, Controller, Post, Res } from "@nestjs/common";
import { type Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { setAccessTokenCookie } from "./cookies";

@Controller("")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.auth.login(dto.email, dto.password);

    setAccessTokenCookie(res, access_token);
    return { success: true };
  }
}
