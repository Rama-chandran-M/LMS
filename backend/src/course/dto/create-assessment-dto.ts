import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAssessmentDTO {

  @IsString()
  title !: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  passing_score !: number;

  @IsString()
  fk_course_id !: string;
}