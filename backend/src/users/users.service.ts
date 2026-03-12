import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getUserWithPreferenceById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { preference: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email ?? undefined,
      avatar: user.avatar ?? undefined,
      phone: user.phone ?? undefined,
      viber: user.viber ?? undefined,
      telegram: user.telegram ?? undefined,
      whatsapp: user.whatsapp ?? undefined,
      language: user.preference?.language ?? "ua",
    };
  }

  async setLanguage(userId: string, language: string) {
    await this.prisma.preference.upsert({
      where: { userId },
      update: { language },
      create: {
        userId,
        language,
      },
    });
  }

  async getUserByResetToken(token: string) {
    return this.prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });
  }

  async setPasswordResetToken(userId: string, token: string, expires: Date) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }

  async getUserWithPreferenceByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { preference: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email ?? undefined,
      language: user.preference?.language ?? "ua",
    };
  }
}
