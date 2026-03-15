import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAssessment,
  getAttemptDetails,
  getAttemptHistory,
  submitAssessment,
} from '../api/assessment';
import { SubmitAssessmentPayload } from '../../types/mycourse_type';

export const assessmentKeys = {
  detail: (id: string) => ['assessments', 'detail', id] as const,
  history: (id: string) => ['assessments', 'history', id] as const,
  attempt: (id: string) => ['assessments', 'attempt', id] as const,
};


export const useAssessment = (assessmentId: string) => {
  return useQuery({
    queryKey: assessmentKeys.detail(assessmentId),
    queryFn: () => getAssessment(assessmentId),
    enabled: !!assessmentId,
  });
};

export const useSubmitAssessment = (assessmentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitAssessmentPayload) =>
      submitAssessment(assessmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.detail(assessmentId) });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.history(assessmentId) });
    },
  });
};

export const useAttemptHistory = (assessmentId: string) => {
  return useQuery({
    queryKey: assessmentKeys.history(assessmentId),
    queryFn: () => getAttemptHistory(assessmentId),
    enabled: !!assessmentId,
  });
};

export const useAttemptDetails = (attemptId: string) => {
  return useQuery({
    queryKey: assessmentKeys.attempt(attemptId),
    queryFn: () => getAttemptDetails(attemptId),
    enabled: !!attemptId,
    staleTime: Infinity,
  });
};
