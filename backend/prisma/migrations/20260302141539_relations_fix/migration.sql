/*
  Warnings:

  - You are about to drop the column `tutorId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `linkedUserId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `telegram` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `tutorId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `viber` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `students` table. All the data in the column will be lost.
  - The primary key for the `tutor_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tutor_profiles` table. All the data in the column will be lost.
  - The primary key for the `tutor_subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tutorId` on the `tutor_subjects` table. All the data in the column will be lost.
  - You are about to drop the `tutor_formats` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tutorUserId,userId]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tutorUserId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorUserId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorUserId` to the `tutor_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_linkedUserId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "tutor_formats" DROP CONSTRAINT "tutor_formats_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "tutor_subjects" DROP CONSTRAINT "tutor_subjects_tutorId_fkey";

-- DropIndex
DROP INDEX "events_tutorId_startAt_idx";

-- DropIndex
DROP INDEX "students_tutorId_idx";

-- DropIndex
DROP INDEX "tutor_profiles_userId_key";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "tutorId",
ADD COLUMN     "tutorUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "avatar",
DROP COLUMN "linkedUserId",
DROP COLUMN "phone",
DROP COLUMN "telegram",
DROP COLUMN "tutorId",
DROP COLUMN "viber",
DROP COLUMN "whatsapp",
ADD COLUMN     "tutorUserId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "tutor_profiles" DROP CONSTRAINT "tutor_profiles_pkey",
DROP COLUMN "id",
ADD COLUMN     "formats" TEXT[],
ADD CONSTRAINT "tutor_profiles_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "tutor_subjects" DROP CONSTRAINT "tutor_subjects_pkey",
DROP COLUMN "tutorId",
ADD COLUMN     "tutorUserId" TEXT NOT NULL,
ADD CONSTRAINT "tutor_subjects_pkey" PRIMARY KEY ("tutorUserId", "subjectId");

-- DropTable
DROP TABLE "tutor_formats";

-- DropEnum
DROP TYPE "LessonFormat";

-- CreateIndex
CREATE INDEX "events_tutorUserId_startAt_idx" ON "events"("tutorUserId", "startAt");

-- CreateIndex
CREATE INDEX "students_tutorUserId_idx" ON "students"("tutorUserId");

-- CreateIndex
CREATE INDEX "students_userId_idx" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_tutorUserId_userId_key" ON "students"("tutorUserId", "userId");

-- AddForeignKey
ALTER TABLE "tutor_subjects" ADD CONSTRAINT "tutor_subjects_tutorUserId_fkey" FOREIGN KEY ("tutorUserId") REFERENCES "tutor_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_tutorUserId_fkey" FOREIGN KEY ("tutorUserId") REFERENCES "tutor_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_tutorUserId_fkey" FOREIGN KEY ("tutorUserId") REFERENCES "tutor_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
