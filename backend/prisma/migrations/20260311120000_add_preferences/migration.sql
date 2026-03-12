-- CreateTable
CREATE TABLE "preferences" (
  "userId" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'ua',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "preferences_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "preferences"
ADD CONSTRAINT "preferences_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

