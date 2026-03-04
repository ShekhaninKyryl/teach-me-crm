import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as bcrypt from "bcryptjs";

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString });
  return new PrismaClient({
    adapter: new PrismaPg(pool),
  });
}

const prisma = createPrisma();

async function main() {
  const subjects = [
    { label: "Математика", faIcon: "faSquareRootVariable" },
    { label: "Англійська", faIcon: "faLanguage" },
    { label: "Українська", faIcon: "faBook" },
    { label: "Фізика", faIcon: "faAtom" },
    { label: "Хімія", faIcon: "faFlask" },
    { label: "Історія", faIcon: "faLandmark" },
  ];

  const dbSubjects = await Promise.all(
    subjects.map((s) =>
      prisma.subject.upsert({
        where: { label: s.label },
        update: { faIcon: s.faIcon },
        create: { label: s.label, faIcon: s.faIcon },
      }),
    ),
  );

  const tutorsCount = 10;

  for (let i = 1; i <= tutorsCount; i++) {
    const email = `tutor${i}@test.com`;
    const passwordHash = await bcrypt.hash("123456", 10);

    const picked = [...dbSubjects]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2 + (i % 3));

    const formats = i % 2 === 0 ? ["ONLINE"] : ["ONLINE", "OFFLINE"];

    const createdUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: `Tutor ${i}`,
        email,
        passwordHash,
        tutorProfile: {
          create: {
            price: 250 + i * 25,
            rating: Math.round((3.8 + (i % 5) * 0.25) * 10) / 10,
            location: i % 2 === 0 ? "Львів" : "Київ",
            bio: "Готую до НМТ, пояснюю просто і структуровано.",
            maxStudents: 10 + (i % 5),
            formats,
            subjects: {
              create: picked.map((s) => ({
                subject: { connect: { id: s.id } },
              })),
            },
          },
        },
      },
      include: { tutorProfile: true },
    });

    // Студенти для частини тьюторів
    if (createdUser.tutorProfile && i % 2 === 1) {
      const studentsToCreate = 2 + (i % 4);

      for (let j = 1; j <= studentsToCreate; j++) {
        await prisma.student.create({
          data: {
            tutorUserId: createdUser.id, // ✅ FK на TutorProfile.userId (= User.id)
            name: `Student ${i}.${j}`,
            color: ["#F59E0B", "#10B981", "#3B82F6", "#EF4444"][j % 4],
          },
        });
      }
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
