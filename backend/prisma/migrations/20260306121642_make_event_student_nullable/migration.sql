-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_studentId_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "studentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;
