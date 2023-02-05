import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { UserModule } from '@app/user/user.module';
//
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const issuer = configService.get<string>(
          'APP_URL',
          'https://localhost:3000',
        );
        return {
          secret: configService.get<string>('APP_SECRET', ''),
          verifyOptions: { issuer },
          signOptions: { issuer, notBefore: 0 },
        };
      },
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const timeout = configService.get<number>('HTTP_TIMEOUT', 30000);
        return {
          timeout,
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
