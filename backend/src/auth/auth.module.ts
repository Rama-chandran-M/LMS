import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    // Make ConfigService available to this module
    ConfigModule,
    PassportModule,

    // Async JWT configuration
    JwtModule.registerAsync({
      imports: [ConfigModule], // REQUIRED for async DI
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<StringValue>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}