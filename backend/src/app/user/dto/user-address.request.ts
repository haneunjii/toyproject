import { ApiProperty } from '@nestjs/swagger';

import { UserAddressUpdateRequestCommand } from '@app/user/user.commands';

export class UserAddressRequest implements UserAddressUpdateRequestCommand {
  @ApiProperty({
    description: '위도',
    example: '127.1086228',
  })
  latitude: string;

  @ApiProperty({
    description: '경도',
    example: '37.4012191',
  })
  longitude: string;
}
