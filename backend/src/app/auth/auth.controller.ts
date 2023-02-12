import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from '@app/auth/auth.service';
import { KakaoAuthRequest } from '@app/auth/dto/kakao-auth.request';
import { TokenResponse } from '@app/auth/dto/token.response';
import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { Request } from '@app/infrastructure/types/request.types';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';
import { UserService } from '@app/user/user.service';
import { UserSNS } from '@domain/user/user';
@Controller('auth')
@ApiTags('[인증] 계정')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'API 호출에 필요한 회원의 기본 정보를 호출합니다.' })
  @ApiBearerAuth()
  async getMyProfile(
    @Req() { userData }: Request,
  ): Promise<UserProfileResponse> {
    const user = await this.userService.getProfile(userData);
    return new UserProfileResponse({
      ...user,
      profileImageUrl: user.profile.profileImageUrl,
    });
  }

  @Post('login/kakao')
  @ApiOperation({ summary: '카카오 로그인을 진행합니다.' })
  @ApiBody({ type: KakaoAuthRequest })
  @ApiResponse({
    type: TokenResponse,
  })
  async kakaoLogin(
    @Body() accountRequestInfo: KakaoAuthRequest,
  ): Promise<TokenResponse> {
    // 카카오 토큰 조회 후 계정 정보 가져오기
    const { code, domain } = accountRequestInfo;
    if (!code || !domain) {
      throw new BadRequestException('카카오 정보가 없습니다.');
    }

    const kakao = await this.authService.kakaoLogin({ code, domain });
    console.log('kakao', kakao);
    if (!kakao.id) {
      throw new BadRequestException('카카오 정보가 없습니다.');
    }

    const user = await this.userService.findByUsername(kakao.id.toString());
    if (!user) {
      await this.userService.joinUser({
        user: {
          username: kakao.id.toString(),
          nickname: kakao.kakao_account.profile.nickname,
        },
        authType: {
          username: kakao.id.toString(),
          snsType: UserSNS.KAKAO,
        },
        profile: {
          profileImageUrl: kakao.kakao_account.profile.profile_image_url,
        },
      });

      return this.authService.login(kakao.id.toString());
    }

    return this.authService.login(user.username);
  }

  @Patch('refresh')
  @ApiOperation({ summary: '액세스 토큰을 갱신합니다.' })
  @ApiResponse({
    type: TokenResponse,
  })
  async refresh(@Req() req: Request): Promise<TokenResponse> {
    return this.authService.refresh(req);
  }

  @Delete('logout')
  @ApiOperation({ summary: '토큰을 만료 처리합니다.' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res,
  ): Promise<boolean> {
    return this.authService.logout(req, res);
  }
}
