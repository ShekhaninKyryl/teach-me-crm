import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
    const rows = await this.prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        email: string | null;
        avatar: string | null;
        phone: string | null;
        viber: string | null;
        telegram: string | null;
        whatsapp: string | null;
        language: string | null;
      }>
    >(
      Prisma.sql`
        SELECT
          u.id,
          u.name,
          u.email,
          u.avatar,
          u.phone,
          u.viber,
          u.telegram,
          u.whatsapp,
          p.language
        FROM users u
        LEFT JOIN preferences p ON p."userId" = u.id
        WHERE u.id = ${id}
        LIMIT 1
      `,
    );

    const user = rows[0];
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
      language: user.language ?? "ua",
    };
  }

  async setLanguage(userId: string, language: string) {
    await this.prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO preferences ("userId", language, "createdAt", "updatedAt")
        VALUES (${userId}, ${language}, NOW(), NOW())
        ON CONFLICT ("userId")
        DO UPDATE SET language = EXCLUDED.language, "updatedAt" = NOW()
      `,
    );
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
}
