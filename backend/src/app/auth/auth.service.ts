import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from '../../constants';

import {
  KakaoUserInfo,
  UserRequestCommand,
} from '@app/auth/commands/kakao.command';
import { TokenResponse } from '@app/auth/dto/token.response';
import {
  JwtDecodedData,
  JwtSubjectType,
} from '@app/infrastructure/types/jwt.types';
import { Request } from '@app/infrastructure/types/request.types';
import { UserService } from '@app/user/user.service';
import { InvalidTokenException } from '@domain/errors/auth.errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async kakaoLogin(data: UserRequestCommand): Promise<KakaoUserInfo> {
    const { code, domain } = data;
    if (!code) {
      throw new UnauthorizedException('카카오 정보가 없습니다.');
    }
    if (!domain) {
      throw new UnauthorizedException('도메인 정보가 없습니다.');
    }
    const body = {
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('KAKAO_API_KEY'),
      redirect_uri: domain,
      code,
    };
    console.log(1);

    const { data: kakaoAuthData, status: kakaoAuthStatus } =
      await this.httpService.axiosRef.request({
        method: 'POST',
        url: `https://kauth.kakao.com/oauth/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        data: body,
      });
    console.log(kakaoAuthData, kakaoAuthStatus);

    if (kakaoAuthStatus !== 200) {
      throw new UnauthorizedException();
    }

    // Token 을 가져왔을 경우 사용자 정보 조회
    const headerUserInfo = {
      Authorization: 'Bearer ' + kakaoAuthData.access_token,
    };

    const responseUserInfo = await this.httpService.axiosRef.request({
      method: 'GET',
      url: `https://kapi.kakao.com/v2/user/me`,
      headers: headerUserInfo,
    });
    console.log(responseUserInfo);

    if (responseUserInfo.status !== 200) {
      throw new UnauthorizedException();
    }
    const userInfo: KakaoUserInfo = responseUserInfo.data;

    return userInfo;
  }

  async login(username: string): Promise<TokenResponse> {
    const user = await this.userService.findByUsername(username);

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user.id),
      this.generateRefreshToken(user.id),
    ]);
    return { accessToken, refreshToken };
  }

  async refresh(req: Request): Promise<TokenResponse> {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException();

    const token = <JwtDecodedData>this.jwtService.decode(refreshToken);

    if (!token || token.sub !== JwtSubjectType.REFRESH) {
      throw new InvalidTokenException();
    }

    const account = await this.userService.findById(token.user_id);
    const accessToken = await this.generateAccessToken(account.id);

    return new TokenResponse({ accessToken });
  }

  logout(req: Request, res) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException();

    res.clearCookie('refresh_token', {
      path: '/auth',
      httpOnly: true,
    });

    return true;
  }

  protected async generateAccessToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { user_id: userId },
      {
        expiresIn: ACCESS_TOKEN_EXPIRE,
        subject: JwtSubjectType.ACCESS,
      },
    );
  }

  protected async generateRefreshToken(userId: string): Promise<string> {
    return this.jwtService.signAsync(
      { user_id: userId },
      {
        expiresIn: REFRESH_TOKEN_EXPIRE,
        subject: JwtSubjectType.REFRESH,
      },
    );
  }
}
