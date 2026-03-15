
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StudentAnswerDto {
  @IsUUID()
  question_id: string;

  @IsOptional()
  @IsUUID()
  choice_id?: string;

  @IsOptional()
  @IsString()
  text_answer?: string;
}

export class SubmitAssessmentDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StudentAnswerDto)
  answers: StudentAnswerDto[];
}
