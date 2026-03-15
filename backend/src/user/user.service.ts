import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async adduser(dto: CreateUserDto) {
    const ALLOWED_ROLES = [Role.STUDENT, Role.INSTRUCTOR];

    if (!ALLOWED_ROLES.includes(dto.user_role)) {
      throw new ForbiddenException('Invalid role selection');
    }

    try {
      return await this.prisma.user.create({
        data: {
          full_name: dto.full_name,
          email: dto.email,
          password: dto.password,
          user_role: dto.user_role,
        },
        select: {
          user_id: true,
          user_role: true,
          full_name: true,
          email: true,
          // password: false (excluded)
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('A user with this email already exists');
      }
      throw e;
    }
  }

  async getusers() {
    return this.prisma.user.findMany({
      select: {
        user_id: true,
        user_role: true,
        full_name: true,
        email: true,
        // password: false (excluded)
      },
    });
  }
}