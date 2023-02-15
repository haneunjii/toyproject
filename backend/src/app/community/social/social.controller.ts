import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { SocialCreateRequest } from '@app/community/social/dto/social-create.request';
import { SocialPreviewResponse } from '@app/community/social/dto/social-preview.response';
import { SocialProfileResponse } from '@app/community/social/dto/social-profile.response';
import { SocialUpdateRequest } from '@app/community/social/dto/social-update-request';
import { SocialService } from '@app/community/social/social.service';
import { Pagination } from '@app/infrastructure/types/pagination.types';
import { Request } from '@app/infrastructure/types/request.types';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';
import { SocialGroupType } from '@domain/social/social-group';

@Controller('socials')
export class SocialController {
  //TODO: 소셜링 구현
  constructor(private readonly socialService: SocialService) {}

  @Get()
  @ApiOperation({ summary: '소셜링 목록 조회' })
  @ApiResponse({ type: SocialPreviewResponse, isArray: true })
  async getSocials(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<Pagination<SocialPreviewResponse>> {
    const { items, meta } = await this.socialService.getSocials({
      page,
      limit,
    });

    return {
      items,
      meta,
    };
  }

  @Get(':socialId')
  @ApiOperation({ summary: '소셜링 상세 조회' })
  @ApiResponse({ type: SocialProfileResponse })
  async getSocialProfile(
    @Param('socialId', ParseUUIDPipe) socialId: string,
  ): Promise<SocialProfileResponse> {
    const socialGroup = await this.socialService.getSocialProfile(socialId);
    return new SocialProfileResponse({
      ...socialGroup,
      members: socialGroup.members.map(
        (member) =>
          new UserProfileResponse({
            ...member.user,
            ...member.user.profile,
          }),
      ),
    });
  }

  @Get(':socialId/invite-requests')
  @ApiOperation({ summary: '소셜링 초대 요청 목록 조회' })
  @ApiResponse({ type: UserProfileResponse, isArray: true })
  async getSocialInviteRequestList(
    @Param('socialId', ParseUUIDPipe) socialId: string,
  ): Promise<UserProfileResponse[]> {
    const users = await this.socialService.getSocialInviteRequestList(socialId);
    return users.map(
      (user) =>
        new UserProfileResponse({
          ...user,
          ...user.profile,
        }),
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '소셜링 생성' })
  @ApiBody({
    type: SocialCreateRequest,
    examples: {
      '온라인 소셜링 생성': {
        value: {
          title: '소셜링 제목',
          content: '소셜링 내용',
          recruitment: 10,
          type: SocialGroupType.EXERCISE,
          recruitmentConditions: {
            maxAge: 50,
            minAge: 20,
            onlyMale: false,
            onlyFemale: false,
          },
          thumbnailUrl: 'https://thumbnail.url',
          needApprove: true,
          endAt: new Date(),
          isOffline: false,
          socialAt: new Date(),
        },
      },
      '오프라인 소셜링 생성': {
        value: {
          title: '소셜링 제목',
          content: '소셜링 내용',
          recruitment: 10,
          type: SocialGroupType.EXERCISE,
          recruitmentConditions: {
            maxAge: 50,
            minAge: 20,
            onlyMale: false,
            onlyFemale: false,
          },
          thumbnailUrl: 'https://thumbnail.url',
          needApprove: true,
          endAt: new Date(),
          isOffline: true,
          socialPlace: {
            buildingName: '빌딩 이름',
            latitude: 37.123456,
            longitude: 127.123456,
            placeAddress: '상세 주소',
            region1DepthName: '시/도',
            region2DepthName: '시/군/구',
            region3DepthName: '동/읍/면',
          },
          socialAt: new Date(),
        },
      },
    },
  })
  @ApiResponse({ type: SocialProfileResponse })
  @ApiBearerAuth()
  async createSocial(
    @Body() body: SocialCreateRequest,
    @Req() { user }: Request,
  ): Promise<SocialProfileResponse> {
    console.log(body);
    const socialGroup = await this.socialService.createSocial(body, user);
    console.log(socialGroup);
    return new SocialProfileResponse({
      ...socialGroup,
      members: socialGroup.members.map(
        (member) =>
          new UserProfileResponse({
            ...member.user,
            ...member.user.profile,
          }),
      ),
    });
  }

  @Post(':socialId/join')
  @ApiOperation({ summary: '소셜링 가입' })
  @ApiResponse({ type: Boolean })
  async joinSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.joinSocial(socialId, user);
  }

  @Post(':socialId/request-invite')
  @ApiOperation({ summary: '소셜링 초대 신청' })
  @ApiResponse({ type: Boolean })
  async requestInviteSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.requestInviteSocial(socialId, user);
  }

  @Post(':socialId/leave')
  @ApiOperation({ summary: '소셜링 탈퇴' })
  @ApiResponse({ type: Boolean })
  async leaveSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.leaveSocial(socialId, user);
  }

  @Post(':socialId/kick/:userId')
  @ApiOperation({ summary: '소셜링 추방' })
  @ApiResponse({ type: Boolean })
  async kickSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.kickSocial(socialId, userId, user);
  }

  @Post(':socialId/report')
  @ApiOperation({ summary: '소셜링 신고' })
  @ApiResponse({ type: Boolean })
  async reportSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return;
  }

  @Patch(':socialId')
  @ApiOperation({ summary: '소셜링 수정' })
  @ApiBody({ type: SocialUpdateRequest })
  @ApiResponse({ type: SocialProfileResponse })
  async updateSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
    @Body() data: SocialUpdateRequest,
  ): Promise<SocialProfileResponse> {
    const socialGroup = await this.socialService.updateSocial(
      socialId,
      user,
      data,
    );
    return new SocialProfileResponse({
      ...socialGroup,
      members: socialGroup.members.map(
        (member) =>
          new UserProfileResponse({
            ...member.user,
            ...member.user.profile,
          }),
      ),
    });
  }

  @Delete(':socialId')
  @ApiOperation({ summary: '소셜링 삭제' })
  @ApiResponse({ type: Boolean })
  async deleteSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.deleteSocial(socialId, user);
  }
}
