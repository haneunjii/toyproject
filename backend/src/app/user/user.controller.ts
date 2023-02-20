import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { Request } from '@app/infrastructure/types/request.types';
import { UserAddressRequest } from '@app/user/dto/user-address.request';
import { UserAddressResponse } from '@app/user/dto/user-address.response';
import { UserService } from '@app/user/user.service';
import { AUTH_ERRORS } from '@domain/errors/auth.errors';
import { USER_ERRORS } from '@domain/errors/user.errors';

@ApiTags('[유저] 계정')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('address/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '사용자의 위치 정보를 업데이트합니다.',
    externalDocs: {
      description: '카카오 API: 좌표로 주소 변환하기',
      url: 'https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address',
    },
  })
  @ApiBody({ type: UserAddressRequest })
  @ApiResponse({ type: UserAddressResponse })
  @ApiNotFoundResponse({ description: USER_ERRORS.USER_NOT_FOUND })
  @ApiBadRequestResponse({ description: AUTH_ERRORS.KAKAO_API_FAILED })
  @ApiBearerAuth()
  async updateUserAddress(
    @Body() address: UserAddressRequest,
    @Req() { user }: Request,
  ): Promise<UserAddressResponse> {
    const userAddress = await this.userService.updateUserAddress(
      user.id,
      address,
    );
    return new UserAddressResponse(userAddress);
  }
}
