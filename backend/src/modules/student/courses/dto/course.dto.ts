
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class EnrollCourseDto {
  @IsUUID()
  course_id: string;
}

export class CourseQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  technology?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  limit?: number = 10;
}
