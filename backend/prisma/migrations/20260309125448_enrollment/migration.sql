/*
  Warnings:

  - The values [MCQ_SINGLE,MCQ_MULTIPLE] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `duration_minutes` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the column `fk_module_id` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the column `max_attempts` on the `assessments` table. All the data in the column will be lost.
  - You are about to drop the column `total_marks` on the `assessments` table. All the data in the column will be lost.
  - The primary key for the `enrollments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `question_marks` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `question_order` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the `attempt_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `options` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fk_course_id]` on the table `assessments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,course_id]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fk_course_id` on table `assessments` required. This step will fail if there are existing NULL values in that column.
  - The required column `entrollment_id` was added to the `enrollments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE');
ALTER TABLE "public"."questions" ALTER COLUMN "question_type" DROP DEFAULT;
ALTER TABLE "questions" ALTER COLUMN "question_type" TYPE "QuestionType_new" USING ("question_type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "public"."QuestionType_old";
ALTER TABLE "questions" ALTER COLUMN "question_type" SET DEFAULT 'MULTIPLE_CHOICE';
COMMIT;

-- DropForeignKey
ALTER TABLE "assessments" DROP CONSTRAINT "assessments_fk_module_id_fkey";

-- DropForeignKey
ALTER TABLE "attempt_answers" DROP CONSTRAINT "attempt_answers_fk_attempt_id_fkey";

-- DropForeignKey
ALTER TABLE "attempt_answers" DROP CONSTRAINT "attempt_answers_fk_option_id_fkey";

-- DropForeignKey
ALTER TABLE "attempt_answers" DROP CONSTRAINT "attempt_answers_fk_question_id_fkey";

-- DropForeignKey
ALTER TABLE "attempts" DROP CONSTRAINT "attempts_fk_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "attempts" DROP CONSTRAINT "attempts_fk_user_id_fkey";

-- DropForeignKey
ALTER TABLE "options" DROP CONSTRAINT "options_fk_question_id_fkey";

-- DropIndex
DROP INDEX "assessments_fk_module_id_key";

-- AlterTable
ALTER TABLE "assessments" DROP COLUMN "duration_minutes",
DROP COLUMN "fk_module_id",
DROP COLUMN "max_attempts",
DROP COLUMN "total_marks",
ADD COLUMN     "passing_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
ALTER COLUMN "fk_course_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_pkey",
ADD COLUMN     "entrollment_id" TEXT NOT NULL,
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD CONSTRAINT "enrollments_pkey" PRIMARY KEY ("entrollment_id");

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "question_marks",
DROP COLUMN "question_order",
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "question_type" SET DEFAULT 'MULTIPLE_CHOICE';

-- DropTable
DROP TABLE "attempt_answers";

-- DropTable
DROP TABLE "attempts";

-- DropTable
DROP TABLE "options";

-- CreateTable
CREATE TABLE "module_completions" (
    "completion_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "module_completions_pkey" PRIMARY KEY ("completion_id")
);

-- CreateTable
CREATE TABLE "question_choices" (
    "choice_id" TEXT NOT NULL,
    "choice_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "fk_question_id" TEXT NOT NULL,

    CONSTRAINT "question_choices_pkey" PRIMARY KEY ("choice_id")
);

-- CreateTable
CREATE TABLE "assessment_attempts" (
    "attempt_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_user_id" TEXT NOT NULL,
    "fk_assessment_id" TEXT NOT NULL,

    CONSTRAINT "assessment_attempts_pkey" PRIMARY KEY ("attempt_id")
);

-- CreateTable
CREATE TABLE "student_answers" (
    "answer_id" TEXT NOT NULL,
    "text_answer" TEXT,
    "fk_attempt_id" TEXT NOT NULL,
    "fk_question_id" TEXT NOT NULL,
    "fk_choice_id" TEXT,

    CONSTRAINT "student_answers_pkey" PRIMARY KEY ("answer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "module_completions_user_id_module_id_key" ON "module_completions"("user_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "assessments_fk_course_id_key" ON "assessments"("fk_course_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_user_id_course_id_key" ON "enrollments"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "module_completions" ADD CONSTRAINT "module_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_completions" ADD CONSTRAINT "module_completions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "course_modules"("module_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_choices" ADD CONSTRAINT "question_choices_fk_question_id_fkey" FOREIGN KEY ("fk_question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_attempts" ADD CONSTRAINT "assessment_attempts_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_attempts" ADD CONSTRAINT "assessment_attempts_fk_assessment_id_fkey" FOREIGN KEY ("fk_assessment_id") REFERENCES "assessments"("assessment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_fk_attempt_id_fkey" FOREIGN KEY ("fk_attempt_id") REFERENCES "assessment_attempts"("attempt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_fk_question_id_fkey" FOREIGN KEY ("fk_question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_answers" ADD CONSTRAINT "student_answers_fk_choice_id_fkey" FOREIGN KEY ("fk_choice_id") REFERENCES "question_choices"("choice_id") ON DELETE SET NULL ON UPDATE CASCADE;
