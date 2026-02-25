import { Tutor } from "@shared/types/tutor";
import { Filter, FilterType } from "@shared/types/filter";
import { LessonFormat, Prisma } from "@prisma/client";

export type TutorProfileWithInclude = Prisma.TutorProfileGetPayload<{
  include: ReturnType<typeof tutorInclude>;
}>;

export function tutorInclude() {
  return {
    user: true,
    subjects: { include: { subject: true } },
    formats: true,
  } satisfies Prisma.TutorProfileInclude;
}

export function mapTutorProfileToDto(tp: TutorProfileWithInclude): Tutor {
  return {
    id: tp.id,

    name: tp.user?.name ?? "",
    email: tp.user?.email ?? "",
    avatar: tp.user?.avatar ?? undefined,
    phone: tp.user?.phone ?? undefined,
    viber: tp.user?.viber ?? undefined,
    telegram: tp.user?.telegram ?? undefined,
    whatsapp: tp.user?.whatsapp ?? undefined,

    subjects: (tp.subjects ?? []).map((x: any) => x.subject.label),
    format: (tp.formats ?? []).map((x: any) => x.format.toLowerCase()),

    rating: tp.rating,
    price: tp.price,
    location: tp.location ?? undefined,
    bio: tp.bio ?? undefined,

    availability: tp.availability ? safeParseAvailability(tp.availability) : [],
    maxStudents: tp.maxStudents ?? undefined,
  };
}

function safeParseAvailability(value: any): string[] {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

const spreadFilterByType = (filters: Filter[]) => {
  const result: Partial<Record<FilterType, string[]>> = {};

  for (const f of filters) {
    const v = f.value?.trim();
    if (!v) continue;

    (result[f.type] ??= []).push(v);
  }

  for (const key of Object.keys(result) as FilterType[]) {
    result[key] = Array.from(new Set(result[key]));
  }

  return result;
};

export function mapFiltersToPrismaWhere(
  filters: Filter[],
): Prisma.TutorProfileWhereInput | undefined {
  const spread = spreadFilterByType(filters);

  const where: Prisma.TutorProfileWhereInput = {};

  if (spread.subject?.length) {
    where.subjects = { some: { subject: { label: { in: spread.subject } } } };
  }

  if (spread.format?.length) {
    where.formats = {
      some: {
        format: {
          in: spread.format.map((f) => f.toUpperCase()) as LessonFormat[],
        },
      },
    };
  }

  if (spread.city?.length) {
    where.location = { in: spread.city };
  }

  if (spread.search?.length) {
    const terms = spread.search;

    where.OR = terms.flatMap((q) => [
      { user: { name: { equals: q, mode: "insensitive" } } },
      { bio: { contains: q, mode: "insensitive" } },
    ]);
  }

  if (spread.price?.length) {
    const raw = spread.price[0];
    const [a, b] = raw.split("-").map((x) => x.trim());

    const min = a ? Number(a) : undefined;
    const max = b ? Number(b) : undefined;

    const price: Prisma.IntFilter = {};
    if (Number.isFinite(min)) price.gte = min!;
    if (Number.isFinite(max)) price.lte = max!;

    if (Object.keys(price).length) {
      where.price = price;
    }
  }

  // TODO: fix this when availability filter will be implemented on frontend
  // if (spread.available?.length) {
  //     where.availability = { hasSome: spread.available };
  // }

  return Object.keys(where).length ? where : undefined;
}
