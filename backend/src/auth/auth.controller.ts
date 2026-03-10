import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { clearAccessTokenCookie, setAccessTokenCookie } from "./cookies";
import { AuthGuard } from "./auth.guard";
import { ResetPasswordDto } from "./dto/reset-password.dto";

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

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    clearAccessTokenCookie(res);
    return { success: true };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  getMe(@Req() req: Request) {
    return req.user;
  }

  @Post("forgot-password")
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.auth.forgotPassword(dto.email);
    return { success: true };
  }

  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.auth.resetPassword(dto.token, dto.newPassword);
    return { success: true };
  }
}
