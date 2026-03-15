import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class StudentModulesService {
  private readonly logger = new Logger(StudentModulesService.name);

  constructor(private readonly prisma: PrismaService) { }

  private async verifyEnrollment(userId: string, moduleId: string) {
    const module = await this.prisma.courseModule.findUnique({
      where: { module_id: moduleId },
      select: {
        module_id: true,
        module_title: true,
        fk_course_id: true,
      },
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: module.fk_course_id,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException(
        'You must be enrolled in this course to access its modules',
      );
    }

    return { module, enrollment };
  }

  async getCourseModules(userId: string, courseId: string) {
    // ...existing code...



    const enrollment = await this.prisma.enrollment.findUnique({
      where: { user_id_course_id: { user_id: userId, course_id: courseId } },
      select: { entrollment_id: true, progress: true },
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this course');
    }

    const course = await this.prisma.course.findUnique({
      where: { course_id: courseId },
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
          orderBy: { module_id: 'asc' },
        },
      },
    });

    const assessment = await this.prisma.assessment.findUnique({
      where: {
        fk_course_id: courseId
      },
      select: {
        assessment_id: true,
        description: true,
        title: true
      }
    });


    // ...existing code...


    if (!course) throw new NotFoundException('Course not found');

    const completions = await this.prisma.moduleCompletion.findMany({
      where: {
        user_id: userId,
        module_id: { in: course.modules.map((m) => m.module_id) },
      },
      select: { module_id: true, completed_at: true },
    });

    const completionMap = new Map(completions.map((c) => [c.module_id, c.completed_at]));

    const modulesWithStatus = course.modules.map((mod) => ({
      ...mod,
      is_completed: completionMap.has(mod.module_id),
      completed_at: completionMap.get(mod.module_id) ?? null,
    }));


    return {
      message: 'Course modules retrieved',
      data: {
        course_id: course.course_id,
        course_name: course.course_name,
        technology: course.technology,
        overall_progress: enrollment.progress,
        total_modules: course.modules.length,
        completed_count: completions.length,
        modules: modulesWithStatus,
        assessment_details: assessment
      },
    };
  }

  async getModuleWithSections(userId: string, moduleId: string) {
    const { module, enrollment } = await this.verifyEnrollment(userId, moduleId);

    const fullModule = await this.prisma.courseModule.findUnique({
      where: { module_id: moduleId },
      select: {
        module_id: true,
        module_title: true,
        module_description: true,
        fk_course_id: true,
        sections: {
          select: {
            section_id: true,
            section_title: true,
            section_content: true,
            section_images: true,
            image_description: true,
            content_url: true,
            url_description: true,
            created_at: true,
          },
          orderBy: { created_at: 'asc' },
        },
      },
    });
    const completion = await this.prisma.moduleCompletion.findUnique({
      where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
      select: { completed_at: true },
    });

    const allModules = await this.prisma.courseModule.findMany({
      where: { fk_course_id: module.fk_course_id },
      select: { module_id: true, module_title: true },
      orderBy: { module_id: 'asc' },
    });

    const currentIndex = allModules.findIndex((m) => m.module_id === moduleId);
    const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
    const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

    return {
      message: 'Module content retrieved',
      data: {
        ...fullModule,
        is_completed: !!completion,
        completed_at: completion?.completed_at ?? null,
        current_progress: enrollment.progress,
        navigation: {
          previous_module: prevModule,
          next_module: nextModule,
          current_position: currentIndex + 1,
          total_modules: allModules.length,
        },
      },
    };
  }

  async markModuleAsComplete(userId: string, moduleId: string) {
    const { module, enrollment } = await this.verifyEnrollment(userId, moduleId);

    const existing = await this.prisma.moduleCompletion.findUnique({
      where: { user_id_module_id: { user_id: userId, module_id: moduleId } },
    });

    if (existing) {
      throw new ConflictException('You have already completed this module');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const completion = await tx.moduleCompletion.create({
        data: { user_id: userId, module_id: moduleId },
        select: { completion_id: true, completed_at: true },
      });

      const totalModules = await tx.courseModule.count({
        where: { fk_course_id: module.fk_course_id },
      });

      const completedModules = await tx.moduleCompletion.count({
        where: {
          user_id: userId,
          module: { fk_course_id: module.fk_course_id },
        },
      });

      const newProgress =
        totalModules > 0
          ? parseFloat(((completedModules / totalModules) * 100).toFixed(2))
          : 0;

      const updatedEnrollment = await tx.enrollment.update({
        where: {
          user_id_course_id: {
            user_id: userId,
            course_id: module.fk_course_id,
          },
        },
        data: { progress: newProgress },
        select: { progress: true, entrollment_id: true },
      });

      return {
        completion,
        progress: updatedEnrollment.progress,
        completed_modules: completedModules,
        total_modules: totalModules,
        course_completed: newProgress === 100,
      };
    });

    this.logger.log(
      `Student ${userId} completed module ${moduleId}. Progress: ${result.progress}%`,
    );

    return {
      message: result.course_completed
        ? '🎉 Congratulations! You have completed all modules in this course!'
        : `Module marked as complete. Progress updated to ${result.progress}%`,
      data: {
        module_id: moduleId,
        module_title: module.module_title,
        completion_id: result.completion.completion_id,
        completed_at: result.completion.completed_at,
        progress: {
          percentage: result.progress,
          completed_modules: result.completed_modules,
          total_modules: result.total_modules,
          course_completed: result.course_completed,
        },
      },
    };
  }

  async getMyCompletions(userId: string) {
    const completions = await this.prisma.moduleCompletion.findMany({
      where: { user_id: userId },
      select: {
        completion_id: true,
        completed_at: true,
        module: {
          select: {
            module_id: true,
            module_title: true,
            course: {
              select: {
                course_id: true,
                course_name: true,
                technology: true,
              },
            },
          },
        },
      },
      orderBy: { completed_at: 'desc' },
    });

    return {
      message: 'Module completions retrieved',
      data: {
        total_completions: completions.length,
        completions,
      },
    };
  }
}
