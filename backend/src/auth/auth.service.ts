import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const isValid = await bcrypt.compare(password, user.password);
    const isValid = password==user.password;
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.user_id,
      role: user.user_role,
      email: user.email,
      full_name: user.full_name, // include name so frontend can display it
    };
    return {
      access_token: this.jwtService.sign(payload),
      user_id: user.user_id, // Add this line
    };
  }
}