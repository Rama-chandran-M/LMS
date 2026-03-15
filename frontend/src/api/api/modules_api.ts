import api from '../axios';
import {
  ApiResponse,
  CompleteModuleResult,
  ModuleCompletion,
  ModuleWithSections,
} from '../../types/mycourse_type';


export const getCourseModules = async (
  courseId: string,
): Promise<{
  course_id: string;
  course_name: string;
  technology: string;
  overall_progress: number;
  total_modules: number;
  completed_count: number;
  assessment_details: {
    assessment_id: string;
    description: string;
    title: string;
  };
  modules: {
    module_id: string;
    module_title: string;
    module_description: string;
    is_completed: boolean;
    completed_at: string | null;
    _count: { sections: number };
  }[];
}> => {
  const { data } = await api.get<ApiResponse<any>>(
    `/student/courses/${courseId}/modules`,
  );
  return data.data;
};

export const getModuleContent = async (moduleId: string): Promise<ModuleWithSections> => {
  const { data } = await api.get<ApiResponse<ModuleWithSections>>(
    `/student/modules/${moduleId}`,
  );
  return data.data;
};

export const markModuleComplete = async (moduleId: string): Promise<CompleteModuleResult> => {
  const { data } = await api.post<ApiResponse<CompleteModuleResult>>(
    `/student/modules/${moduleId}/complete`,
  );
  return data.data;
};

export const getMyCompletions = async (): Promise<{
  total_completions: number;
  completions: ModuleCompletion[];
}> => {
  const { data } = await api.get<ApiResponse<any>>('/student/completions');
  return data.data;
};
