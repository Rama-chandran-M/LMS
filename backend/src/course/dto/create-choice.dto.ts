import { IsBoolean, IsString } from 'class-validator';

export class CreateQuestionChoiceDTO {

  @IsString()
  choice_text !: string;

  @IsBoolean()
  is_correct !: boolean;

}