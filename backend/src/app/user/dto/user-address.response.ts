import { ApiProperty } from '@nestjs/swagger';

import { UserAddressResponseCommand } from '@app/user/user.commands';

export class UserAddressResponse implements UserAddressResponseCommand {
  @ApiProperty({
    description: '지역 1Depth, 시도 단위',
    example: '경기도',
  })
  region1DepthName: string;

  @ApiProperty({
    description: '지역 2Depth, 구 단위',
    example: '성남시 분당구',
  })
  region2DepthName: string;

  @ApiProperty({
    description: '지역 3Depth, 동 단위',
    example: '삼평동',
  })
  region3DepthName: string;

  constructor(data: UserAddressResponseCommand) {
    Object.assign(this, data);
  }
}
