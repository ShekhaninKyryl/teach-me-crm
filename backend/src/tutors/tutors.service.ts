import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTutorDto } from "./dto/create-tutor.dto";
import { UpdateTutorDto } from "./dto/update-tutor.dto";
import * as bcrypt from "bcryptjs";
import { StudentAsUserDto } from "./dto/student-as-user.dto";
import {
  mapFiltersToPrismaWhere,
  mapTutorProfileToDto,
  tutorInclude,
  TutorProfileWithInclude,
} from "src/tutors/functions";
import { Tutor } from "@shared/types/tutor";
import { Filter } from "@shared/types/filter";
import { PrismaService } from "prisma/prisma.service";
import { LessonFormat } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TutorsService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
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
    return this.prisma.$transaction(async (tx) => {
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
              maxStudents: 3,

              subjects: {
                create: subjects.map((s) => ({
                  subjectId: s.id,
                })),
              },

              formats: dto.formats?.length
                ? {
                    create: dto.formats.map((f) => ({
                      format: f.toUpperCase() as LessonFormat,
                    })),
                  }
                : undefined,
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      const payload = { sub: user.id, email: user.email, name: user.name };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    });
  }

  async updateTutorProfile(userId: string, dto: UpdateTutorDto) {
    return this.prisma.$transaction(async (tx) => {
      const tutor = await tx.tutorProfile.findUnique({
        where: { userId },
        select: {
          id: true,
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

        await tx.tutorSubject.deleteMany({ where: { tutorId: tutor.id } });

        if (subjects.length) {
          await tx.tutorSubject.createMany({
            data: subjects.map((s) => ({ tutorId: tutor.id, subjectId: s.id })),
            skipDuplicates: true,
          });
        }
      }

      if (dto.formats) {
        await tx.tutorFormat.deleteMany({ where: { tutorId: tutor.id } });

        if (dto.formats.length) {
          await tx.tutorFormat.createMany({
            data: dto.formats.map((f) => ({
              tutorId: tutor.id,
              format: f.toUpperCase() as LessonFormat,
            })),
            skipDuplicates: true,
          });
        }
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
  async getTutorsStudents(tutorId: string): Promise<StudentAsUserDto[]> {
    const students = await this.prisma.student.findMany({
      where: { tutorId },
      include: { linkedUser: true },
      orderBy: { createdAt: "asc" },
    });

    return students.map((s) => ({
      id: s.id,
      name: s.linkedUser?.name ?? s.name,
      email: s.linkedUser?.email ?? null,

      avatar: s.linkedUser?.avatar ?? s.avatar ?? null,

      phone: s.linkedUser?.phone ?? s.phone ?? null,
      viber: s.linkedUser?.viber ?? s.viber ?? null,
      telegram: s.linkedUser?.telegram ?? s.telegram ?? null,
      whatsapp: s.linkedUser?.whatsapp ?? s.whatsapp ?? null,
    }));
  }

  async saveTutorsStudents(
    tutorId: string,
    students: StudentAsUserDto[],
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.student.findMany({
        where: { tutorId },
        select: { id: true },
      });
      const existingIds = new Set(existing.map((x) => x.id));

      const incomingIds = new Set<string>();

      for (const st of students ?? []) {
        if (st?.id && existingIds.has(st.id)) {
          incomingIds.add(st.id);

          await tx.student.update({
            where: { id: st.id },
            data: {
              name: st.name,
              avatar: st.avatar ?? undefined,
              phone: st.phone ?? undefined,
              viber: st.viber ?? undefined,
              telegram: st.telegram ?? undefined,
              whatsapp: st.whatsapp ?? undefined,
            },
          });
        } else {
          const created = await tx.student.create({
            data: {
              tutorId,
              name: st.name,
              avatar: st.avatar ?? undefined,
              phone: st.phone ?? undefined,
              viber: st.viber ?? undefined,
              telegram: st.telegram ?? undefined,
              whatsapp: st.whatsapp ?? undefined,
            },
            select: { id: true },
          });
          incomingIds.add(created.id);
        }
      }

      const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));

      if (toDelete.length) {
        await tx.student.deleteMany({
          where: {
            id: { in: toDelete },
            events: { none: {} },
          },
        });
      }
    });
  }
}
