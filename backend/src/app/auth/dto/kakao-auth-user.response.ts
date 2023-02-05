import { ApiProperty } from '@nestjs/swagger';

import { KakaoAccount, KakaoUserInfo } from '@app/auth/commands/kakao.command';

export class KakaoAuthUserResponse implements KakaoUserInfo {
  @ApiProperty({
    description: '사용자 고유번호',
  })
  id!: number;

  @ApiProperty({
    description: '자동 연결 설정을 비활성화한 경우만 존재',
  })
  has_signed_up?: boolean;

  @ApiProperty({
    description: '서비스에 연결 완료된 시각, UTC',
  })
  connected_at?: Date;

  @ApiProperty({
    description: '카카오싱크 간편가입을 통해 로그인한 시각, UTC',
  })
  synched_at?: Date;

  @ApiProperty({
    description: '사용자 프로퍼티(Property) 사용자 프로퍼티 참고',
  })
  properties?: JSON;

  @ApiProperty({
    description: '사용자 카카오계정 정보',
  })
  kakao_account?: KakaoAccount;

  constructor(data: KakaoUserInfo) {
    Object.assign(this, data);
  }
}
