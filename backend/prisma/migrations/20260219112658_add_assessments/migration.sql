-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ_SINGLE', 'MCQ_MULTIPLE');

-- CreateTable
CREATE TABLE "assessments" (
    "assessment_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "total_marks" INTEGER,
    "duration_minutes" INTEGER,
    "max_attempts" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_module_id" TEXT NOT NULL,
    "fk_course_id" TEXT,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("assessment_id")
);

-- CreateTable
CREATE TABLE "questions" (
    "question_id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_order" INTEGER,
    "question_marks" INTEGER DEFAULT 1,
    "question_type" "QuestionType" NOT NULL DEFAULT 'MCQ_SINGLE',
    "fk_assessment_id" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "options" (
    "option_id" TEXT NOT NULL,
    "option_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "fk_question_id" TEXT NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "attempts" (
    "attempt_id" TEXT NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "fk_assessment_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "score" DOUBLE PRECISION,

    CONSTRAINT "attempts_pkey" PRIMARY KEY ("attempt_id")
);

-- CreateTable
CREATE TABLE "attempt_answers" (
    "answer_id" TEXT NOT NULL,
    "fk_attempt_id" TEXT NOT NULL,
    "fk_question_id" TEXT NOT NULL,
    "fk_option_id" TEXT,
    "is_correct" BOOLEAN NOT NULL,
    "selected_text" TEXT,

    CONSTRAINT "attempt_answers_pkey" PRIMARY KEY ("answer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assessments_fk_module_id_key" ON "assessments"("fk_module_id");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_fk_module_id_fkey" FOREIGN KEY ("fk_module_id") REFERENCES "course_modules"("module_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_fk_course_id_fkey" FOREIGN KEY ("fk_course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_fk_assessment_id_fkey" FOREIGN KEY ("fk_assessment_id") REFERENCES "assessments"("assessment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_fk_question_id_fkey" FOREIGN KEY ("fk_question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_fk_assessment_id_fkey" FOREIGN KEY ("fk_assessment_id") REFERENCES "assessments"("assessment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answers" ADD CONSTRAINT "attempt_answers_fk_attempt_id_fkey" FOREIGN KEY ("fk_attempt_id") REFERENCES "attempts"("attempt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answers" ADD CONSTRAINT "attempt_answers_fk_question_id_fkey" FOREIGN KEY ("fk_question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answers" ADD CONSTRAINT "attempt_answers_fk_option_id_fkey" FOREIGN KEY ("fk_option_id") REFERENCES "options"("option_id") ON DELETE SET NULL ON UPDATE CASCADE;
