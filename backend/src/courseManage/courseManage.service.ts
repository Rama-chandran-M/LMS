import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseManageService {

  constructor(private prisma: PrismaService) {}

  async getInstructorCourses(instructorId: string) {

    return this.prisma.course.findMany({
      where: {
        fk_instructor_id: instructorId
      },
      include: {
        enrolled_students: true
      }
    });

  }

  async deleteCourse(courseId: string) {

    return this.prisma.course.delete({
      where: {
        course_id: courseId
      }
    });

  }

  async getCourseStats(courseId: string) {

    const students = await this.prisma.enrollment.count({
      where: {
        course_id: courseId
      }
    });

    const attempts = await this.prisma.assessmentAttempt.count({
      where: {
        assessment: {
          fk_course_id: courseId
        }
      }
    });

    const passed = await this.prisma.assessmentAttempt.count({
      where: {
        passed: true,
        assessment: {
          fk_course_id: courseId
        }
      }
    });

    const progress = await this.prisma.enrollment.aggregate({
      where: {
        course_id: courseId
      },
      _avg: {
        progress: true
      }
    });

    return {
      students,
      attempts,
      passRate: attempts ? (passed / attempts) * 100 : 0,
      avgProgress: progress._avg.progress ?? 0
    };

  }

}