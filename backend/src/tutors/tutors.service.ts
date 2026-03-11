import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTutorDto } from "./dto/create-tutor.dto";
import { UpdateTutorDto } from "./dto/update-tutor.dto";
import * as bcrypt from "bcryptjs";
import {
  CreateStudentAsUserDto,
  StudentAsUserDto,
} from "./dto/student-as-user.dto";
import {
  mapFiltersToPrismaWhere,
  mapTutorProfileToDto,
  tutorInclude,
  TutorProfileWithInclude,
} from "src/tutors/functions";
import { Tutor } from "@shared/types/tutor";
import { Filter } from "@shared/types/filter";
import { PrismaService } from "prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { FREE_STUDENTS_CAPACITY_LIMIT } from "@constants/index";
import { Prisma, EventStatus } from "@prisma/client";
import { NotificationsService } from "src/notifications/notifications.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TutorsService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

  async getTopTutors() {
    return this.prisma.tutorProfile.findMany({
      take: 10,
      orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
      include: tutorInclude(),
    });
  }

  async getTutorById(id: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId: id },
      include: tutorInclude(),
    });
    if (!tutor) throw new NotFoundException("Tutor not found");
    return mapTutorProfileToDto(tutor);
  }

  async searchTutors(filters: Filter[]): Promise<Tutor[]> {
    const where = mapFiltersToPrismaWhere(filters);

    const tutors: TutorProfileWithInclude[] =
      await this.prisma.tutorProfile.findMany({
        take: 50,
        where,
        include: tutorInclude(),
      });

    return tutors.map((t) => mapTutorProfileToDto(t));
  }

  async createTutorProfile(dto: CreateTutorDto) {
    const language = dto.language === "en" ? "en" : "ua";

    const created = await this.prisma.$transaction(async (tx) => {
      const passwordHash = await bcrypt.hash(dto.password, 10);

      const subjects = await Promise.all(
        (dto.subjects ?? []).map((label) =>
          tx.subject.upsert({
            where: { label },
            update: {},
            create: { label },
          }),
        ),
      );

      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash,
          avatar: dto.avatar,
          phone: dto.phone,
          viber: dto.viber,
          telegram: dto.telegram,
          whatsapp: dto.whatsapp,
          tutorProfile: {
            create: {
              price: dto.price,
              location: dto.location,
              bio: dto.bio,
              availability: dto.availability,
              maxStudents: FREE_STUDENTS_CAPACITY_LIMIT,

              subjects: {
                create: subjects.map((s) => ({
                  subjectId: s.id,
                })),
              },

              formats: dto.formats ?? [],
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      await tx.$executeRaw(
        Prisma.sql`
          INSERT INTO preferences ("userId", language, "createdAt", "updatedAt")
          VALUES (${user.id}, ${language}, NOW(), NOW())
          ON CONFLICT ("userId")
          DO UPDATE SET language = EXCLUDED.language, "updatedAt" = NOW()
        `,
      );

      const payload = { sub: user.id, email: user.email, name: user.name };

      return {
        access_token: await this.jwtService.signAsync(payload),
        user,
      };
    });

    const frontendUrl = this.configService.getOrThrow<string>("FRONTEND_URL");
    const workspaceLink = `${frontendUrl}/${language}/workspace`;

    try {
      if (created.user.email) {
        await this.notificationsService.sendTutorWelcomeEmail(
          created.user.email,
          workspaceLink,
          created.user.name,
          language,
        );
      }
    } catch {
      // Registration should succeed even if email provider is temporarily unavailable.
    }

    return {
      access_token: created.access_token,
    };
  }

  async updateTutorProfile(userId: string, dto: UpdateTutorDto) {
    return this.prisma.$transaction(async (tx) => {
      const tutor = await tx.tutorProfile.findUnique({
        where: { userId },
        select: {
          userId: true,
          user: {
            select: { passwordHash: true },
          },
        },
      });

      if (!tutor) throw new NotFoundException("Tutor not found");

      const userData: any = {};
      if (dto.avatar !== undefined) userData.avatar = dto.avatar;
      if (dto.name !== undefined) userData.name = dto.name;
      if (dto.email !== undefined) userData.email = dto.email;
      if (dto.phone !== undefined) userData.phone = dto.phone;
      if (dto.viber !== undefined) userData.viber = dto.viber;
      if (dto.telegram !== undefined) userData.telegram = dto.telegram;
      if (dto.whatsapp !== undefined) userData.whatsapp = dto.whatsapp;

      if (Object.keys(userData).length) {
        await tx.user.update({
          where: { id: userId },
          data: userData,
        });
      }

      const profileData: any = {};
      if (dto.price !== undefined) profileData.price = dto.price;
      if (dto.location !== undefined) profileData.location = dto.location;
      if (dto.bio !== undefined) profileData.bio = dto.bio;
      if (dto.availability !== undefined)
        profileData.availability = dto.availability;

      if (Object.keys(profileData).length) {
        await tx.tutorProfile.update({
          where: { userId },
          data: profileData,
        });
      }

      if (dto.subjects) {
        const labels = dto.subjects;

        const subjects = await Promise.all(
          labels.map((label) =>
            tx.subject.upsert({
              where: { label },
              update: {},
              create: { label },
            }),
          ),
        );

        await tx.tutorSubject.deleteMany({
          where: { tutorUserId: tutor.userId },
        });

        if (subjects.length) {
          await tx.tutorSubject.createMany({
            data: subjects.map((s) => ({
              tutorUserId: tutor.userId,
              subjectId: s.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      if (dto.formats) {
        await tx.tutorProfile.update({
          where: { userId: tutor.userId },
          data: {
            formats: dto.formats.map((f) => f.toUpperCase()),
          },
        });
      }

      if (dto.password) {
        if (!dto.currentPassword) {
          throw new BadRequestException("currentPassword is required");
        }

        const storedHash = tutor.user?.passwordHash;
        if (!storedHash) {
          throw new BadRequestException("Password is not set for this account");
        }

        const isCorrect = await bcrypt.compare(dto.currentPassword, storedHash);
        if (!isCorrect) {
          throw new BadRequestException("Current password is incorrect");
        }

        const newHash = await bcrypt.hash(dto.password, 10);
        await tx.user.update({
          where: { id: userId },
          data: { passwordHash: newHash },
        });
      }

      return this.getTutorById(userId);
    });
  }
  async getTutorsStudents(userId: string): Promise<StudentAsUserDto[]> {
    const tutorExists = await this.prisma.tutorProfile.findUnique({
      where: { userId },
      select: { userId: true },
    });

    if (!tutorExists) {
      throw new BadRequestException(`Tutor not found for userId=${userId}`);
    }

    const students = await this.prisma.student.findMany({
      where: { tutorUserId: userId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    return students.map((s) => ({
      id: s.id,
      name: s.user?.name ?? s.name,
      email: s.user?.email ?? null,
      color: s.color ?? null,

      avatar: s.user?.avatar ?? null,
      phone: s.user?.phone ?? null,
      viber: s.user?.viber ?? null,
      telegram: s.user?.telegram ?? null,
      whatsapp: s.user?.whatsapp ?? null,
    }));
  }

  async saveTutorsStudents(
    tutorUserId: string,
    students: CreateStudentAsUserDto[],
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.student.findMany({
        where: { tutorUserId },
        select: { id: true },
      });
      const existingStudentIds = new Set(existing.map((x) => x.id));

      const possibleUserIds = Array.from(
        new Set((students ?? []).map((s) => s?.userId).filter(Boolean)),
      ) as string[];

      const existingUsers = possibleUserIds.length
        ? await tx.user.findMany({
            where: { id: { in: possibleUserIds } },
            select: { id: true },
          })
        : [];

      const existingUserIds = new Set(existingUsers.map((u) => u.id));
      const incomingStudentIds = new Set<string>();

      for (const st of students ?? []) {
        if (!st) continue;

        if (st.id && existingStudentIds.has(st.id)) {
          incomingStudentIds.add(st.id);

          await tx.student.update({
            where: { id: st.id },
            data: {
              name: st.name,
              color: st.color,
              ...(st.userId && existingUserIds.has(st.userId)
                ? { userId: st.userId }
                : st.userId === null
                  ? { userId: null }
                  : {}),
            },
          });

          continue;
        }

        const userIdToLink =
          st.userId && existingUserIds.has(st.userId) ? st.userId : null;

        const created = await tx.student.create({
          data: {
            tutorUserId,
            userId: userIdToLink,
            name: st.name,
            color: st.color,
          },
          select: { id: true },
        });

        incomingStudentIds.add(created.id);
      }

      const toDelete = [...existingStudentIds].filter(
        (id) => !incomingStudentIds.has(id),
      );

      if (!toDelete.length) {
        return;
      }

      const blockedStudents = await tx.student.findMany({
        where: {
          id: { in: toDelete },
          events: {
            some: {
              status: {
                in: [EventStatus.PENDING, EventStatus.COMPLETED],
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (blockedStudents.length) {
        throw new BadRequestException(
          `Students can be deleted while they have active lessons: ${blockedStudents
            .map((s) => s.name)
            .join(", ")}`,
        );
      }

      const blockedIds = new Set(blockedStudents.map((s) => s.id));

      const deletableIds = toDelete.filter((id) => !blockedIds.has(id));

      if (deletableIds.length) {
        await tx.student.deleteMany({
          where: {
            id: { in: deletableIds },
          },
        });
      }
    });
  }
  async getMaxStudents(tutorId: string): Promise<number> {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { userId: tutorId },
      select: { maxStudents: true },
    });
    if (!tutor) throw new NotFoundException("Tutor not found");
    return tutor.maxStudents || FREE_STUDENTS_CAPACITY_LIMIT;
  }

  async updateMaxStudents(tutorId: string, maxStudents: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const studentsCount = await tx.student.count({
        where: { tutorUserId: tutorId },
      });

      if (maxStudents < studentsCount) {
        throw new BadRequestException(
          `Cannot reduce capacity to ${maxStudents}. Tutor already has ${studentsCount} students.`,
        );
      }

      await tx.tutorProfile.update({
        where: { userId: tutorId },
        data: { maxStudents },
      });
    });
  }
}
