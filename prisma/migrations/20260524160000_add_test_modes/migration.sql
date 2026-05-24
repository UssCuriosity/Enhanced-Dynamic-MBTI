-- AlterTable
ALTER TABLE "TestPlan" ADD COLUMN "testMode" TEXT NOT NULL DEFAULT 'single';
ALTER TABLE "TestPlan" ADD COLUMN "modeChanged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DailySession" ADD COLUMN "sessionType" TEXT NOT NULL DEFAULT 'single';

-- DropIndex / Recreate unique constraint for day-night sessions
DROP INDEX IF EXISTS "DailySession_planId_dayNumber_key";
CREATE UNIQUE INDEX "DailySession_planId_dayNumber_sessionType_key" ON "DailySession"("planId", "dayNumber", "sessionType");
