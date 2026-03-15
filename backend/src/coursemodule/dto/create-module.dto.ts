import { IsNotEmpty, IsString } from "class-validator";

export class CreateModuleDto {
    @IsString()
    @IsNotEmpty()
    module_title: string

    @IsString()
    @IsNotEmpty()
    module_description: string
}