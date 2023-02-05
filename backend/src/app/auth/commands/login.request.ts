import { UserSNS } from '@domain/user/user';

export type LoginRequest = {
  username: string;
  password: string;
};
export type KakaoLoginRequest = {
  authType: UserSNS.KAKAO;
  userId: string;
};
