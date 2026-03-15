import api from '../axios';
import {
  ApiResponse,
  Course,
  CourseDetails,
  CourseProgress,
  CourseQueryParams,
  Enrollment,
  PaginatedCourses,
} from '../../types/mycourse_type';

export const getAllCourses = async (params?: CourseQueryParams): Promise<PaginatedCourses> => {
  const { data } = await api.get<ApiResponse<PaginatedCourses>>('/student/courses', { params });
  return data.data;
};

export const getCourseDetails = async (courseId: string): Promise<CourseDetails> => {
  const { data } = await api.get<ApiResponse<CourseDetails>>(`/student/courses/${courseId}`);
  return data.data;
};

export const getMyEnrolledCourses = async (): Promise<{
  total: number;
  enrollments: Enrollment[];
}> => {
  const { data } = await api.get<ApiResponse<{ total: number; enrollments: Enrollment[] }>>(
    '/student/courses/my-courses',
  );
  return data.data;
};

export const getCourseProgress = async (courseId: string): Promise<CourseProgress> => {
  const { data } = await api.get<ApiResponse<CourseProgress>>(
    `/student/courses/${courseId}/progress`,
  );
  return data.data;
};

export const enrollInCourse = async (
  courseId: string,
): Promise<{ entrollment_id: string; enrolled_at: string; progress: number; course: Course }> => {
  const { data } = await api.post<ApiResponse<any>>('/student/courses/enroll', {
    course_id: courseId,
  });
  return data.data;
};
