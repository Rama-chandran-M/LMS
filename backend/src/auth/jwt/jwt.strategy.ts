// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(config: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
//     });
//   }

//   async validate(payload: any) {
//     return {
//       userId: payload.sub,
//       role: payload.role,
//       email: payload.email,
//     };
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../../common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService, // Use ConfigService for the secret
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Get the secret from environment variables safely
      secretOrKey: configService.get<string>('JWT_SECRET') || 'lms-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    // 1. Database check ensures the user wasn't deleted since the token was issued
    const user = await this.prisma.user.findUnique({
      where: { user_id: payload.sub },
      select: {
        user_id: true,
        email: true,
        full_name: true,
        user_role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists or session is invalid');
    }

    // 2. This returned object becomes the "req.user" in your controllers
    return {
      sub: user.user_id,
      email: user.email,
      full_name: user.full_name,
      user_role: user.user_role,
    };
  }
}
