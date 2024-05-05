/*
  Warnings:

  - The values [WITHDRAW] on the enum `StudentEnrolledCourseStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StudentEnrolledCourseStatus_new" AS ENUM ('ONGOING', 'COMPLETED', 'WITHDRAWN');
ALTER TABLE "student_enrolled_courses" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "student_enrolled_courses" ALTER COLUMN "status" TYPE "StudentEnrolledCourseStatus_new" USING ("status"::text::"StudentEnrolledCourseStatus_new");
ALTER TYPE "StudentEnrolledCourseStatus" RENAME TO "StudentEnrolledCourseStatus_old";
ALTER TYPE "StudentEnrolledCourseStatus_new" RENAME TO "StudentEnrolledCourseStatus";
DROP TYPE "StudentEnrolledCourseStatus_old";
ALTER TABLE "student_enrolled_courses" ALTER COLUMN "status" SET DEFAULT 'ONGOING';
COMMIT;
