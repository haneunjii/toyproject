import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { UserRequestCommand } from '@app/auth/commands/kakao.command';

export class KakaoAuthRequest implements UserRequestCommand {
  @ApiProperty({ description: '카카오 회원 accessToken' })
  @IsString()
  @IsNotEmpty()
  accessToken!: string;
}
