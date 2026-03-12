import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

const USER_PUBLIC_SELECT = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  phone: true,
  viber: true,
  telegram: true,
  whatsapp: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: USER_PUBLIC_SELECT,
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_PUBLIC_SELECT,
    });
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
    return this.prisma.user.findUnique({
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
