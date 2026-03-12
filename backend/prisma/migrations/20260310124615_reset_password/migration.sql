-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- Ensure resetPasswordToken matches Prisma `@unique` constraint (unique for non-NULL values)
CREATE UNIQUE INDEX "users_resetPasswordToken_key"
ON "users"("resetPasswordToken")
WHERE "resetPasswordToken" IS NOT NULL;
