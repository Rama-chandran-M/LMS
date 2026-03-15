import { IsNotEmpty, IsString } from "class-validator";

export class CreateCourseDto{
    @IsString()
    @IsNotEmpty()
    course_name !: string

    @IsString()
    @IsNotEmpty()
    technology !: string

    @IsString()
    @IsNotEmpty()
    fk_instructor_id !: string

}