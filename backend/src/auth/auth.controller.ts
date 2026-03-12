import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { clearAccessTokenCookie, setAccessTokenCookie } from "./cookies";
import { AuthGuard } from "./auth.guard";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { UsersService } from "../users/users.service";

@Controller("")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  private getUserId(req: Request) {
    const authUser = req.user as { id?: string } | undefined;
    if (!authUser?.id) {
      throw new UnauthorizedException();
    }
    return authUser.id;
  }

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
    return this.users.getUserWithPreferenceById(this.getUserId(req));
  }

  @Patch("me/language")
  @UseGuards(AuthGuard)
  async updateLanguage(@Req() req: Request, @Body() dto: UpdateLanguageDto) {
    await this.users.setLanguage(this.getUserId(req), dto.language);
    return { success: true };
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
