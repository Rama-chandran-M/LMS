import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CourseQueryDto, EnrollCourseDto } from './dto/course.dto';

@Injectable()
export class StudentCoursesService {
  private readonly logger = new Logger(StudentCoursesService.name);

  constructor(private readonly prisma: PrismaService) { }

  async getAllCourses(query: CourseQueryDto) {
    const { technology, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (technology) {
      where.technology = { contains: technology, mode: 'insensitive' };
    }

    if (search) {
      where.course_name = { contains: search, mode: 'insensitive' };
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        select: {
          course_id: true,
          course_name: true,
          technology: true,
          created_at: true,
          instructor: {
            select: { full_name: true, email: true },
          },
          _count: {
            select: {
              modules: true,
              enrolled_students: true,
            },
          },
          assessment: {
            select: {
              assessment_id: true,
              title: true,
              passing_score: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      message: 'Courses retrieved successfully',
      data: {
        courses,
        pagination: {
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit),
        },
      },
    };
  }

  async getCourseDetails(courseId: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: courseId },
      select: {
        course_id: true,
        course_name: true,
        technology: true,
        created_at: true,
        instructor: {
          select: { full_name: true, email: true },
        },
        modules: {
          select: {
            module_id: true,
            module_title: true,
            module_description: true,
            _count: { select: { sections: true } },
          },
          orderBy: { module_id: 'asc' },
        },
        assessment: {
          select: {
            assessment_id: true,
            title: true,
            description: true,
            passing_score: true,
            _count: { select: { questions: true } },
          },
        },
        _count: {
          select: { enrolled_students: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course not found`);
    }

    let enrollmentInfo: { entrollment_id: string; enrolled_at: Date; progress: number } | null = null;

    if (userId) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: { user_id_course_id: { user_id: userId, course_id: courseId } },
        select: {
          entrollment_id: true,
          enrolled_at: true,
          progress: true,
        },
      });
      enrollmentInfo = enrollment;
    }

    return {
      message: 'Course details retrieved',
      data: { ...course, enrollment: enrollmentInfo },
    };
  }

  async enrollInCourse(userId: string, dto: EnrollCourseDto) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: dto.course_id },
      select: { course_id: true, course_name: true, fk_instructor_id: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.fk_instructor_id === userId) {
      throw new ForbiddenException('Instructors cannot enroll in their own courses');
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { user_id_course_id: { user_id: userId, course_id: dto.course_id } },
    });

    if (existing) {
      throw new ConflictException('You are already enrolled in this course');
    }

    const enrollment = await this.prisma.enrollment.create({
      data: {
        user_id: userId,
        course_id: dto.course_id,
        progress: 0,
      },
      select: {
        entrollment_id: true,
        enrolled_at: true,
        progress: true,
        course: {
          select: { course_id: true, course_name: true, technology: true },
        },
      },
    });

    this.logger.log(`Student ${userId} enrolled in course ${dto.course_id}`);

    return {
      message: `Successfully enrolled in "${course.course_name}"`,
      data: enrollment,
    };
  }

  async getMyEnrolledCourses(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { user_id: userId },
      select: {
        entrollment_id: true,
        enrolled_at: true,
        progress: true,
        course: {
          select: {
            course_id: true,
            course_name: true,
            technology: true,
            created_at: true,
            instructor: { select: { full_name: true } },
            _count: { select: { modules: true } },
            assessment: {
              select: {
                assessment_id: true,
                title: true,
                passing_score: true,
              },
            },
          },
        },
      },
      orderBy: { enrolled_at: 'desc' },
    });


    const enriched = await Promise.all(
      enrollments.map(async (enrollment) => {
        let bestAttempt: { attempt_id: string; score: number; passed: boolean; attempted_at: Date } | null = null;
        if (enrollment.course.assessment) {
          bestAttempt = await this.prisma.assessmentAttempt.findFirst({
            where: {
              fk_user_id: userId,
              fk_assessment_id: enrollment.course.assessment.assessment_id,
            },
            orderBy: { score: 'desc' },
            select: {
              attempt_id: true,
              score: true,
              passed: true,
              attempted_at: true,
            },
          });
        }
        return { ...enrollment, best_assessment_attempt: bestAttempt };
      }),
    );

    return {
      message: 'Enrolled courses retrieved',
      data: {
        total: enriched.length,
        enrollments: enriched,
      },
    };
  }

  async getCourseProgress(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { user_id_course_id: { user_id: userId, course_id: courseId } },
      select: {
        entrollment_id: true,
        progress: true,
        enrolled_at: true,
        course: {
          select: {
            course_id: true,
            course_name: true,
            technology: true,
            modules: {
              select: {
                module_id: true,
                module_title: true,
                module_description: true,
                _count: { select: { sections: true } },
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this course');
    }

    const completedModules = await this.prisma.moduleCompletion.findMany({
      where: {
        user_id: userId,
        module_id: { in: enrollment.course.modules.map((m) => m.module_id) },
      },
      select: { module_id: true, completed_at: true },
    });

    const completedSet = new Set(completedModules.map((c) => c.module_id));

    const modulesWithStatus = enrollment.course.modules.map((mod) => ({
      ...mod,
      is_completed: completedSet.has(mod.module_id),
      completed_at: completedModules.find((c) => c.module_id === mod.module_id)?.completed_at ?? null,
    }));

    const totalModules = modulesWithStatus.length;
    const completedCount = modulesWithStatus.filter((m) => m.is_completed).length;

    return {
      message: 'Course progress retrieved',
      data: {
        enrollment_id: enrollment.entrollment_id,
        enrolled_at: enrollment.enrolled_at,
        progress: enrollment.progress,
        total_modules: totalModules,
        completed_modules: completedCount,
        course: {
          ...enrollment.course,
          modules: modulesWithStatus,
        },
      },
    };
  }
}
