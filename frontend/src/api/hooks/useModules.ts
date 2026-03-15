import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCourseModules,
  getModuleContent,
  getMyCompletions,
  markModuleComplete,
} from '../api/modules_api';
import { courseKeys } from './useCourses';

export const moduleKeys = {
  courseModules: (courseId: string) => ['modules', 'course', courseId] as const,
  content: (moduleId: string) => ['modules', 'content', moduleId] as const,
  completions: ['modules', 'completions'] as const,
};

export const useCourseModules = (courseId: string) => {
  return useQuery({
    queryKey: moduleKeys.courseModules(courseId),
    queryFn: () => getCourseModules(courseId),
    enabled: !!courseId,
  });
};

export const useModuleContent = (moduleId: string) => {
  return useQuery({
    queryKey: moduleKeys.content(moduleId),
    queryFn: () => getModuleContent(moduleId),
    enabled: !!moduleId,
  });
};

export const useMarkModuleComplete = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleId: string) => markModuleComplete(moduleId),
    onSuccess: (data, moduleId) => {
      queryClient.setQueryData(moduleKeys.content(moduleId), (old: any) =>
        old ? { ...old, is_completed: true, completed_at: data.completed_at } : old,
      );

      queryClient.invalidateQueries({ queryKey: moduleKeys.courseModules(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.progress(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.myCourses });
    },
  });
};

export const useMyCompletions = () => {
  return useQuery({
    queryKey: moduleKeys.completions,
    queryFn: getMyCompletions,
    enabled: !!localStorage.getItem('access_token'),
  });
};
