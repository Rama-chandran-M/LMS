import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  enrollInCourse,
  getAllCourses,
  getCourseDetails,
  getCourseProgress,
  getMyEnrolledCourses,
} from '../api/courses_api';
import { CourseQueryParams } from '../../types/mycourse_type';

export const courseKeys = {
  all: ['courses'] as const,
  list: (params?: CourseQueryParams) => ['courses', 'list', params] as const,
  detail: (id: string) => ['courses', 'detail', id] as const,
  progress: (id: string) => ['courses', 'progress', id] as const,
  myCourses: ['courses', 'my-courses'] as const,
};

export const useAllCourses = (params?: CourseQueryParams) => {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => getAllCourses(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCourseDetails = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => getCourseDetails(courseId),
    enabled: !!courseId,
  });
};

export const useMyEnrolledCourses = () => {
  return useQuery({
    queryKey: courseKeys.myCourses,
    queryFn: getMyEnrolledCourses,
    enabled: !!localStorage.getItem('access_token'),
  });
};

export const useCourseProgress = (courseId: string) => {
  return useQuery({
    queryKey: courseKeys.progress(courseId),
    queryFn: () => getCourseProgress(courseId),
    enabled: !!courseId,
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => enrollInCourse(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.myCourses });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
    },
  });
};
