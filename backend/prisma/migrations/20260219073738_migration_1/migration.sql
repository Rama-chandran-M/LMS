-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'INSTRUCTOR');

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "user_role" "Role" NOT NULL DEFAULT 'STUDENT',
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "technology" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_instructor_id" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "course_modules" (
    "module_id" TEXT NOT NULL,
    "module_title" TEXT NOT NULL,
    "module_describtion" TEXT NOT NULL,
    "fk_course_id" TEXT NOT NULL,

    CONSTRAINT "course_modules_pkey" PRIMARY KEY ("module_id")
);

-- CreateTable
CREATE TABLE "sections" (
    "section_id" TEXT NOT NULL,
    "section_title" TEXT NOT NULL,
    "section_content" TEXT,
    "section_images" TEXT,
    "image_description" TEXT,
    "content_url" TEXT,
    "url_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("section_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_fk_instructor_id_fkey" FOREIGN KEY ("fk_instructor_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_fk_course_id_fkey" FOREIGN KEY ("fk_course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "course_modules"("module_id") ON DELETE CASCADE ON UPDATE CASCADE;
