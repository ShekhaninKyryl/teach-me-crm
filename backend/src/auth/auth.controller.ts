import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { clearAccessTokenCookie, setAccessTokenCookie } from "./cookies";
import { AuthGuard } from "./auth.guard";

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
}
