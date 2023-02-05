import { ApiProperty } from '@nestjs/swagger';

import { loginResponse } from '@app/auth/commands/login.response';

export class TokenResponse {
  @ApiProperty({
    description: 'API 호출에 필요한 JWT Access Token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Access Token 발급에 필요한 JWT Refresh Token',
  })
  refreshToken?: string;

  constructor(tokens: loginResponse) {
    Object.assign(this, tokens);
  }
}
