import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import {
  JwtDecodedData,
  JwtSubjectType,
} from '@app/infrastructure/types/jwt.types';
import { UserService } from '@app/user/user.service';
import { NeedAuthenticationException } from '@domain/errors/auth.errors';
import { User } from '@domain/user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('APP_SECRET', ''),
      ignoreExpiration: false,
    });
  }

  async validate(data: JwtDecodedData): Promise<User> {
    if (data.sub !== JwtSubjectType.ACCESS) {
      throw new NeedAuthenticationException();
    }

    return this.userService.findById(data.user_id);
  }
}
