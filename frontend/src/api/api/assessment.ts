import api from '../axios';
import {
  ApiResponse,
  Assessment,
  AssessmentResult,
  AttemptHistory,
  SubmitAssessmentPayload,
} from '../../types/mycourse_type';

export const getAssessment = async (assessmentId: string): Promise<Assessment> => {
  const { data } = await api.get<ApiResponse<Assessment>>(
    `/student/assessments/${assessmentId}`,
  );
  return data.data;
};

export const submitAssessment = async (
  assessmentId: string,
  payload: SubmitAssessmentPayload,
): Promise<AssessmentResult> => {
  const { data } = await api.post<ApiResponse<AssessmentResult>>(
    `/student/assessments/${assessmentId}/submit`,
    payload,
  );
  return data.data;
};

export const getAttemptHistory = async (assessmentId: string): Promise<AttemptHistory> => {
  const { data } = await api.get<ApiResponse<AttemptHistory>>(
    `/student/assessments/${assessmentId}/history`,
  );
  return data.data;
};

export const getAttemptDetails = async (attemptId: string): Promise<any> => {
  const { data } = await api.get<ApiResponse<any>>(
    `/student/assessments/attempts/${attemptId}`,
  );
  return data.data;
};
