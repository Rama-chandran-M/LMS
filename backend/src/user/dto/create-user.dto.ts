import { IsEnum, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  user_role!: Role; // STUDENT | INSTRUCTOR
}