import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export const AUTH_ERRORS = {
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  KAKAO_API_FAILED: 'KAKAO_API_FAILED',
};

export class InvalidTokenException extends BadRequestException {
  constructor() {
    super('인증 정보가 올바르지 않습니다.', AUTH_ERRORS.TOKEN_INVALID);
  }
}

export class NeedAuthenticationException extends UnauthorizedException {
  constructor() {
    super('로그인이 필요합니다.', AUTH_ERRORS.UNAUTHORIZED);
  }
}

export class KakaoApiFailedException extends BadRequestException {
  constructor() {
    super('카카오 API 호출에 실패했습니다.', AUTH_ERRORS.KAKAO_API_FAILED);
  }
}
