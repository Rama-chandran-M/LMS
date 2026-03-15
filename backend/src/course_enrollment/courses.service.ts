import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CoursesService {
  async listCourses(userId?: string) {
    const courses = await prisma.course.findMany({
      include: { instructor: true },
      orderBy: { created_at: 'desc' },
    });

    if (!userId) return courses.map((c) => ({
      course_id: c.course_id,
      course_name: c.course_name,
      technology: c.technology,
      created_at: c.created_at,
      instructor: { user_id: c.instructor.user_id, full_name: c.instructor.full_name },
    }));

    const enrollments = await prisma.enrollment.findMany({ where: { user_id: userId }, select: { course_id: true } });
    const enrolled = new Set(enrollments.map(e => e.course_id));

    return courses.map((c) => ({
      course_id: c.course_id,
      course_name: c.course_name,
      technology: c.technology,
      created_at: c.created_at,
      instructor: { user_id: c.instructor.user_id, full_name: c.instructor.full_name },
      enrolled: enrolled.has(c.course_id),
    }));
  }

  async getCourseById(courseId: string) {
    return prisma.course.findUnique({
      where: { course_id: courseId },
      include: {
        instructor: { select: { user_id: true, full_name: true } },
        modules: {
          include: { sections: true },
          orderBy: { module_title: 'asc' },
        },
      },
    });
  }

  async enroll(userId: string, courseId: string) {
    // create enrollment if not exists
    await prisma.enrollment.upsert({
      where: { user_id_course_id: { user_id: userId, course_id: courseId } },
      update: {},
      create: { user_id: userId, course_id: courseId },
    });
    return { status: 'ok', enrolled: true };
  }

  async unroll(userId: string, courseId: string) {
    await prisma.enrollment.deleteMany({ where: { user_id: userId, course_id: courseId } });
    return { status: 'ok', enrolled: false };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) return null;
    return { user_id: user.user_id, full_name: user.full_name, email: user.email, role: user.user_role };
  }
}
