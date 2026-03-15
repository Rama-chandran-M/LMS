export interface Course{
    course_id : string;
    course_name:string;
    technology:string;
    fk_instructor_id:string;
    created_at: string;
}
export interface CourseModule{
    module_id: string;
    module_title : string;
    module_description : string;
    fk_course_id : string;
}
export interface Section{
    section_id:string;
    section_title:string;
    section_content?:string;
    sections_images?:string;
    image_description?:string;
    content_url?:string;
    url_description?:string;
    module_id:string;
    created_at:string;
}
export interface CreateCourseDTO {
  course_name: string;
  technology: string;
  fk_instructor_id:string;
}
export interface CreateModuleDto{
    module_title :string;
    module_description : string;
    course_id : string;
}
// export interface CreateSectionDto{
//     section_title : string,
//     module_id : string;
// }
export interface CreateSectionDto {
  section_title: string;
  module_id: string;
  section_content?: string;
  section_images?: string;
  image_description?: string;
  content_url?: string;
  url_description?: string;
}

export interface Assessment {
  assessment_id: string;
  title: string;
  description?: string;
  passing_score: number;
  created_at: string;
  fk_course_id: string;

  questions?: Questions[];
}

export interface CreateAssessmentDTO {
  title: string;
  description?: string;
  passing_score?: number;
  fk_course_id: string;
}


export interface Questions {
  question_id: string;
  question_text: string;
  question_type: "MULTIPLE_CHOICE" | "SHORT_ANSWER";
  points: number;

  fk_assessment_id: string;

  choices?: QuestionChoice[];
}

export interface CreateQuestionDTO {
  question_text: string;
  question_type: "MULTIPLE_CHOICE" | "SHORT_ANSWER";
  points?: number;
  fk_assessment_id: string;

  choices: CreateQuestionChoiceDTO[];
}

export interface QuestionChoice {
  choice_id: string;
  choice_text: string;
  is_correct: boolean;

  fk_question_id: string;
}

export interface CreateQuestionChoiceDTO {
  choice_text: string;
  is_correct: boolean;
}

export interface AssessmentAttempt {
  attempt_id: string;
  score: number;
  passed: boolean;
  attempted_at: string;

  fk_user_id: string;
  fk_assessment_id: string;
}

export interface StudentAnswer {
  answer_id: string;
  text_answer?: string;

  fk_attempt_id: string;
  fk_question_id: string;
  fk_choice_id?: string;
}

export interface SubmitAnswerDTO {
  fk_question_id: string;
  fk_choice_id?: string;
  text_answer?: string;
}