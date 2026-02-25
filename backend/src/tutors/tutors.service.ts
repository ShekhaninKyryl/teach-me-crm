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

@Injectable()
export class TutorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopTutors() {
    return this.prisma.tutorProfile.findMany({
      take: 10,
      orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
      include: tutorInclude(),
    });
  }

  async getTutorById(id: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id },
      include: tutorInclude(),
    });
    if (!tutor) throw new NotFoundException("Tutor not found");
    return tutor;
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
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists)
      throw new BadRequestException("User with this email already exists");

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const labels = dto.subjects ?? [];
    const subjects = await Promise.all(
      labels.map((label) =>
        this.prisma.subject.upsert({
          where: { label },
          update: {},
          create: { label },
        }),
      ),
    );

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        tutorProfile: {
          create: {
            price: dto.price,
            location: dto.location,
            bio: dto.bio,
            availability: dto.availability ?? undefined,
            maxStudents: 3,

            subjects: {
              create: subjects.map((s) => ({
                subject: { connect: { id: s.id } },
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
      select: { id: true, email: true, name: true },
    });
  }

  async updateTutorProfile(tutorId: string, dto: UpdateTutorDto) {
    await this.prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        price: dto.price,
        location: dto.location,
        bio: dto.bio,
        availability: dto.availability ?? undefined,
        maxStudents: dto.maxStudents,
      },
      include: tutorInclude(),
    });

    if (dto.subjects) {
      const subjects = await Promise.all(
        dto.subjects.map((label) =>
          this.prisma.subject.upsert({
            where: { label },
            update: {},
            create: { label },
          }),
        ),
      );

      await this.prisma.tutorSubject.deleteMany({ where: { tutorId } });
      await this.prisma.tutorSubject.createMany({
        data: subjects.map((s) => ({ tutorId, subjectId: s.id })),
      });
    }

    if (dto.formats) {
      await this.prisma.tutorFormat.deleteMany({ where: { tutorId } });
      if (dto.formats.length) {
        await this.prisma.tutorFormat.createMany({
          data: dto.formats.map((f) => ({ tutorId, format: f })),
        });
      }
    }

    return this.getTutorById(tutorId);
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
