/*
  Warnings:

  - You are about to drop the column `module_describtion` on the `course_modules` table. All the data in the column will be lost.
  - Added the required column `module_description` to the `course_modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course_modules" DROP COLUMN "module_describtion",
ADD COLUMN     "module_description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "enrollments" (
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("user_id","course_id")
);

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;
