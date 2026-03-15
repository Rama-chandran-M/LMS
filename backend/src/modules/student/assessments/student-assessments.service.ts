import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { StudentAnswerDto, SubmitAssessmentDto } from './dto/assessment.dto';

@Injectable()
export class StudentAssessmentsService {
  private readonly logger = new Logger(StudentAssessmentsService.name);

  constructor(private readonly prisma: PrismaService) { }

  private async verifyAssessmentAccess(userId: string, assessmentId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { assessment_id: assessmentId },
      select: {
        assessment_id: true,
        title: true,
        description: true,
        passing_score: true,
        fk_course_id: true,
      },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        user_id_course_id: {
          user_id: userId,
          course_id: assessment.fk_course_id,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException(
        'You must be enrolled in this course to access its assessment',
      );
    }

    return { assessment, enrollment };
  }


  async getAssessment(userId: string, assessmentId: string) {
    const { assessment, enrollment } = await this.verifyAssessmentAccess(userId, assessmentId);

    const questions = await this.prisma.questions.findMany({
      where: { fk_assessment_id: assessmentId },
      select: {
        question_id: true,
        question_text: true,
        question_type: true,
        points: true,
        choices: {
          select: {
            choice_id: true,
            choice_text: true,
          },
        },
      },
    });

    const attemptsCount = await this.prisma.assessmentAttempt.count({
      where: {
        fk_user_id: userId,
        fk_assessment_id: assessmentId,
      },
    });

    const bestAttempt = await this.prisma.assessmentAttempt.findFirst({
      where: {
        fk_user_id: userId,
        fk_assessment_id: assessmentId,
      },
      orderBy: { score: 'desc' },
      select: { score: true, passed: true, attempted_at: true },
    });

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    return {
      message: 'Assessment retrieved successfully',
      data: {
        assessment_id: assessment.assessment_id,
        title: assessment.title,
        description: assessment.description,
        passing_score: assessment.passing_score,
        total_points: totalPoints,
        total_questions: questions.length,
        questions,
        your_attempts: {
          count: attemptsCount,
          best_score: bestAttempt?.score ?? null,
          has_passed: bestAttempt?.passed ?? false,
          last_attempted_at: bestAttempt?.attempted_at ?? null,
        },
        course_progress: enrollment.progress,
      },
    };
  }


  async submitAssessment(
    userId: string,
    assessmentId: string,
    dto: SubmitAssessmentDto,
  ) {
    const { assessment } = await this.verifyAssessmentAccess(userId, assessmentId);

    const questions = await this.prisma.questions.findMany({
      where: { fk_assessment_id: assessmentId },
      select: {
        question_id: true,
        question_text: true,
        question_type: true,
        points: true,
        choices: {
          select: {
            choice_id: true,
            choice_text: true,
            is_correct: true,
          },
        },
      },
    });

    if (questions.length === 0) {
      throw new BadRequestException('This assessment has no questions yet');
    }

    const questionMap = new Map(questions.map((q) => [q.question_id, q]));
    for (const answer of dto.answers) {
      if (!questionMap.has(answer.question_id)) {
        throw new BadRequestException(
          `Question ${answer.question_id} does not belong to this assessment`,
        );
      }
    }

    const gradingResults = this.gradeSubmission(questions, dto.answers);
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const scorePercentage =
      totalPoints > 0
        ? parseFloat(((gradingResults.earnedPoints / totalPoints) * 100).toFixed(2))
        : 0;
    const passed = scorePercentage >= assessment.passing_score;

    const attempt = await this.prisma.$transaction(async (tx) => {
      const newAttempt = await tx.assessmentAttempt.create({
        data: {
          fk_user_id: userId,
          fk_assessment_id: assessmentId,
          score: scorePercentage,
          passed,
          answers: {
            create: dto.answers.map((ans) => ({
              fk_question_id: ans.question_id,
              fk_choice_id: ans.choice_id ?? null,
              text_answer: ans.text_answer ?? null,
            })),
          },
        },
        select: {
          attempt_id: true,
          score: true,
          passed: true,
          attempted_at: true,
        },
      });

      return newAttempt;
    });

    this.logger.log(
      `Student ${userId} submitted assessment ${assessmentId}. Score: ${scorePercentage}% | Passed: ${passed}`,
    );

    return {
      message: passed
        ? `🎉 Congratulations! You passed with ${scorePercentage}%!`
        : `Assessment submitted. You scored ${scorePercentage}%. Passing score is ${assessment.passing_score}%.`,
      data: {
        attempt_id: attempt.attempt_id,
        attempted_at: attempt.attempted_at,
        score: scorePercentage,
        passed,
        passing_score: assessment.passing_score,
        points: {
          earned: gradingResults.earnedPoints,
          total: totalPoints,
        },
        question_results: gradingResults.questionResults,
      },
    };
  }

  async getAttemptHistory(userId: string, assessmentId: string) {
    await this.verifyAssessmentAccess(userId, assessmentId);

    const attempts = await this.prisma.assessmentAttempt.findMany({
      where: {
        fk_user_id: userId,
        fk_assessment_id: assessmentId,
      },
      select: {
        attempt_id: true,
        score: true,
        passed: true,
        attempted_at: true,
        answers: {
          select: {
            answer_id: true,
            text_answer: true,
            question: {
              select: {
                question_id: true,
                question_text: true,
                question_type: true,
                points: true,
              },
            },
            choice: {
              select: {
                choice_id: true,
                choice_text: true,
                is_correct: true,
              },
            },
          },
        },
      },
      orderBy: { attempted_at: 'desc' },
    });

    const totalAttempts = attempts.length;
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;
    const hasPassed = attempts.some((a) => a.passed);

    return {
      message: 'Attempt history retrieved',
      data: {
        assessment_id: assessmentId,
        total_attempts: totalAttempts,
        best_score: bestScore,
        has_passed: hasPassed,
        attempts,
      },
    };
  }

  async getAttemptDetails(userId: string, attemptId: string) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { attempt_id: attemptId },
      select: {
        attempt_id: true,
        score: true,
        passed: true,
        attempted_at: true,
        fk_user_id: true,
        assessment: {
          select: {
            assessment_id: true,
            title: true,
            passing_score: true,
            fk_course_id: true,
          },
        },
        answers: {
          select: {
            answer_id: true,
            text_answer: true,
            question: {
              select: {
                question_id: true,
                question_text: true,
                question_type: true,
                points: true,
                choices: {
                  select: {
                    choice_id: true,
                    choice_text: true,
                    is_correct: true,
                  },
                },
              },
            },
            choice: {
              select: {
                choice_id: true,
                choice_text: true,
                is_correct: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.fk_user_id !== userId) {
      throw new ForbiddenException('You can only view your own attempts');
    }

    const annotatedAnswers = attempt.answers.map((ans) => {
      const isCorrect = ans.choice?.is_correct ?? false;
      const correctChoice = ans.question.choices.find((c) => c.is_correct);
      return {
        ...ans,
        is_correct: isCorrect,
        correct_choice: correctChoice ?? null,
      };
    });

    return {
      message: 'Attempt details retrieved',
      data: {
        ...attempt,
        answers: annotatedAnswers,
      },
    };
  }

  private gradeSubmission(
    questions: Array<{
      question_id: string;
      question_text: string;
      question_type: string;
      points: number;
      choices: Array<{ choice_id: string; choice_text: string; is_correct: boolean }>;
    }>,
    submittedAnswers: StudentAnswerDto[],
  ) {
    let earnedPoints = 0;

    const answerMap = new Map(submittedAnswers.map((a) => [a.question_id, a]));

    const questionResults = questions.map((question) => {
      const submitted = answerMap.get(question.question_id);
      let isCorrect = false;
      let pointsEarned = 0;

      if (submitted?.choice_id) {
        const selectedChoice = question.choices.find(
          (c) => c.choice_id === submitted.choice_id,
        );
        isCorrect = selectedChoice?.is_correct ?? false;
        if (isCorrect) {
          pointsEarned = question.points;
          earnedPoints += question.points;
        }
      }

      const correctChoice = question.choices.find((c) => c.is_correct);

      return {
        question_id: question.question_id,
        question_text: question.question_text,
        points_possible: question.points,
        points_earned: pointsEarned,
        is_correct: isCorrect,
        selected_choice_id: submitted?.choice_id ?? null,
        correct_choice: correctChoice
          ? { choice_id: correctChoice.choice_id, choice_text: correctChoice.choice_text }
          : null,
      };
    });

    return { earnedPoints, questionResults };
  }
}
