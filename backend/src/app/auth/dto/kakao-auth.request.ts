import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { UserRequestCommand } from '@app/auth/commands/kakao.command';

export class KakaoAuthRequest implements UserRequestCommand {
  @ApiProperty({ description: '카카오 로그인 요청 코드' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ description: '카카오 로그인 요청 도메인' })
  @IsString()
  @IsNotEmpty()
  domain!: string;
}
