import { IsString, IsEnum, IsInt, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionChoiceDTO } from './create-choice.dto';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export class CreateQuestionDTO {

  @IsString()
  question_text !: string;

  @IsEnum(QuestionType)
  question_type !: QuestionType;

  @IsInt()
  points !: number;

  @IsString()
  fk_assessment_id !: string;

  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionChoiceDTO)
  choices !: CreateQuestionChoiceDTO[];
}