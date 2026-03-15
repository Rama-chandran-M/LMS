

export interface User {
    user_id: string;
    full_name: string;
    email: string;
    user_role: 'STUDENT' | 'INSTRUCTOR';
  }
  
  export interface AuthResponse {
    user: User;
    access_token: string;
  }
  
  export interface RegisterPayload {
    full_name: string;
    email: string;
    password: string;
    user_role: 'STUDENT' | 'INSTRUCTOR';
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  
  export interface Course {
    course_id: string;
    course_name: string;
    technology: string;
    created_at: string;
    instructor: { full_name: string; email: string };
    _count: { modules: number; enrolled_students: number };
    assessment?: { assessment_id: string; title: string; passing_score: number } | null;
  }
  
  export interface Enrollment {
    entrollment_id: string;
    enrolled_at: string;
    progress: number;
    course: Course;
    best_assessment_attempt?: {
      attempt_id: string;
      score: number;
      passed: boolean;
      attempted_at: string;
    } | null;
  }
  
  export interface CourseDetails extends Course {
    modules: {
      module_id: string;
      module_title: string;
      module_description: string;
      _count: { sections: number };
    }[];
    enrollment: { entrollment_id: string; enrolled_at: string; progress: number } | null;
  }
  
  export interface CourseProgress {
    enrollment_id: string;
    enrolled_at: string;
    progress: number;
    total_modules: number;
    completed_modules: number;
    course: {
      course_id: string;
      course_name: string;
      technology: string;
      modules: {
        module_id: string;
        module_title: string;
        module_description: string;
        is_completed: boolean;
        completed_at: string | null;
        _count: { sections: number };
      }[];
    };
  }
  
  export interface PaginatedCourses {
    courses: Course[];
    pagination: { total: number; page: number; limit: number; total_pages: number };
  }
  
  export interface CourseQueryParams {
    technology?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
  
  
  export interface Section {
    section_id: string;
    section_title: string;
    section_content: string | null;
    section_images: string | null;
    image_description: string | null;
    content_url: string | null;
    url_description: string | null;
    created_at: string;
  }
  
  export interface ModuleWithSections {
    module_id: string;
    module_title: string;
    module_description: string;
    fk_course_id: string;
    is_completed: boolean;
    completed_at: string | null;
    current_progress: number;
    sections: Section[];
    navigation: {
      previous_module: { module_id: string; module_title: string } | null;
      next_module: { module_id: string; module_title: string } | null;
      current_position: number;
      total_modules: number;
    };
  }
  
  export interface CompleteModuleResult {
    module_id: string;
    module_title: string;
    completion_id: string;
    completed_at: string;
    progress: {
      percentage: number;
      completed_modules: number;
      total_modules: number;
      course_completed: boolean;
    };
  }
  
  export interface ModuleCompletion {
    completion_id: string;
    completed_at: string;
    module: {
      module_id: string;
      module_title: string;
      course: { course_id: string; course_name: string; technology: string };
    };
  }
  
  
  export interface Choice {
    choice_id: string;
    choice_text: string;
  }
  
  export interface Question {
    question_id: string;
    question_text: string;
    question_type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    points: number;
    choices: Choice[];
  }
  
  export interface Assessment {
    assessment_id: string;
    title: string;
    description: string | null;
    passing_score: number;
    total_points: number;
    total_questions: number;
    questions: Question[];
    your_attempts: {
      count: number;
      best_score: number | null;
      has_passed: boolean;
      last_attempted_at: string | null;
    };
    course_progress: number;
  }
  
  export interface AnswerPayload {
    question_id: string;
    choice_id?: string;
    text_answer?: string;
  }
  
  export interface SubmitAssessmentPayload {
    answers: AnswerPayload[];
  }
  
  export interface QuestionResult {
    question_id: string;
    question_text: string;
    points_possible: number;
    points_earned: number;
    is_correct: boolean;
    selected_choice_id: string | null;
    correct_choice: { choice_id: string; choice_text: string } | null;
  }
  
  export interface AssessmentResult {
    attempt_id: string;
    attempted_at: string;
    score: number;
    passed: boolean;
    passing_score: number;
    points: { earned: number; total: number };
    question_results: QuestionResult[];
  }
  
  export interface AttemptHistory {
    assessment_id: string;
    total_attempts: number;
    best_score: number;
    has_passed: boolean;
    attempts: {
      attempt_id: string;
      score: number;
      passed: boolean;
      attempted_at: string;
    }[];
  }
  
  
  
  export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
  }
  