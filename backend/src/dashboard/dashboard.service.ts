import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getOverviewStats(userId: string) {
        const [coursesEnrolled, assessmentsAttempted, moduleCompletions, attempts] =
            await Promise.all([
                this.prisma.enrollment.count({ where: { user_id: userId } }),
                this.prisma.assessmentAttempt.count({ where: { fk_user_id: userId } }),
                this.prisma.moduleCompletion.count({ where: { user_id: userId } }),
                this.prisma.assessmentAttempt.findMany({
                    where: { fk_user_id: userId },
                    select: { score: true },
                }),
            ]);

        const scores = attempts.filter(a => a.score !== null).map(a => a.score as number);
        const avgScore = scores.length > 0
            ? Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 100) / 100
            : null;

        return { coursesEnrolled, assessmentsAttempted, moduleCompletions, avgScore };
    }

    async getCourseStats(userId: string) {
        const enrollments = await this.prisma.enrollment.findMany({
            where: { user_id: userId },
            include: {
                course: {
                    include: {
                        instructor: { select: { full_name: true } },
                        modules: true,
                        assessment: {
                            include: {
                                attempts: {
                                    where: { fk_user_id: userId },
                                    select: { score: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        return enrollments.map((enrollment) => {
            const course = enrollment.course;
            const scores = course.assessment?.attempts
                .filter((t) => t.score !== null)
                .map((t) => t.score as number) || [];
            const avgScore = scores.length > 0
                ? Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 100) / 100
                : null;

            return {
                courseId: course.course_id,
                courseName: course.course_name,
                technology: course.technology,
                instructor: course.instructor.full_name,
                moduleCount: course.modules.length,
                avgScore,
            };
        });
    }

    async getAssessmentPerformance(userId: string) {
        const attempts = await this.prisma.assessmentAttempt.findMany({
            where: { fk_user_id: userId },
            include: {
                assessment: {
                    include: {
                        course: { select: { course_name: true } },
                    },
                },
            },
        });

        return attempts.map((a) => ({
            attemptId: a.attempt_id,
            assessmentId: a.assessment.assessment_id,
            title: a.assessment.title,
            courseName: a.assessment.course.course_name,
            passingScore: a.assessment.passing_score,
            score: a.score,
            passed: a.passed,
            attemptedAt: a.attempted_at,
        }));
    }

    async getStudentPerformance() {
        const students = await this.prisma.user.findMany({
            where: { user_role: 'STUDENT' },
            include: {
                enrolled_courses: true,
                assessment_attempts: { select: { score: true } },
            },
        });

        return students.map((s) => {
            const scores = s.assessment_attempts
                .filter((a) => a.score !== null)
                .map((a) => a.score as number);

            return {
                userId: s.user_id,
                fullName: s.full_name,
                email: s.email,
                coursesEnrolled: s.enrolled_courses.length,
                assessmentsAttempted: s.assessment_attempts.length,
                avgScore: scores.length > 0
                    ? Math.round((scores.reduce((sum, v) => sum + v, 0) / scores.length) * 100) / 100
                    : null,
            };
        });
    }

    async getRecentAttempts(userId: string) {
        const attempts = await this.prisma.assessmentAttempt.findMany({
            where: { fk_user_id: userId },
            orderBy: { attempted_at: 'desc' },
            take: 10,
            include: {
                student: { select: { full_name: true } },
                assessment: { select: { title: true } },
            },
        });

        return attempts.map((a) => ({
            attemptId: a.attempt_id,
            studentName: a.student.full_name,
            assessmentTitle: a.assessment.title,
            score: a.score,
            passed: a.passed,
            attemptedAt: a.attempted_at,
        }));
    }
}
