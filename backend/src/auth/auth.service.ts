import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "./types/jst";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async login(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const ok = await bcrypt.compare(pass, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { id: user.id, email: user.email, name: user.name };

    return {
      access_token: await this.jwtService.signAsync<JwtPayload>(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService
      .getUserByEmail(email)
      .catch((_) => null);
    if (!user) {
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await this.usersService.setPasswordResetToken(user.id, token, expires);

    const frontendUrl = this.configService.getOrThrow<string>("FRONTEND_URL");
    const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await this.notificationsService.sendPasswordResetEmail(
      user.email ?? email,
      resetLink,
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.getUserByResetToken(token);
    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, passwordHash);
  }
}
