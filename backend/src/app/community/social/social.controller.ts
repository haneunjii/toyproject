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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/guards/jwt.guard';
import { SocialCreateRequest } from '@app/community/social/dto/social-create.request';
import { SocialMemberProfileResponse } from '@app/community/social/dto/social-member-profile.response';
import { SocialPreviewResponse } from '@app/community/social/dto/social-preview.response';
import { SocialProfileResponse } from '@app/community/social/dto/social-profile.response';
import { SocialUpdateRequest } from '@app/community/social/dto/social-update.request';
import { SocialService } from '@app/community/social/social.service';
import { Pagination } from '@app/infrastructure/types/pagination.types';
import { Request } from '@app/infrastructure/types/request.types';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';
import { SOCIAL_ERRORS } from '@domain/errors/social.errors';
import { USER_ERRORS } from '@domain/errors/user.errors';
import { SocialGroupType } from '@domain/social/social-group';

@ApiTags('[커뮤니티] 소셜링')
@Controller('socials')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get('category')
  @ApiOperation({ summary: '소셜링 카테고리 목록 조회' })
  @ApiResponse({ type: String, isArray: true })
  async getSocialCategories(): Promise<string[]> {
    return Object.values(SocialGroupType);
  }

  @Get()
  @ApiOperation({ summary: '소셜링 목록 조회' })
  @ApiQuery({ name: 'category', enum: SocialGroupType, required: false })
  @ApiResponse({ type: SocialPreviewResponse, isArray: true })
  async getSocials(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('category') category: SocialGroupType = SocialGroupType.DANCE,
  ): Promise<Pagination<SocialPreviewResponse>> {
    console.log(category);
    const { items, meta } = await this.socialService.getSocials({
      page,
      limit,
      category,
    });

    return {
      items,
      meta,
    };
  }

  @Get(':socialId')
  @ApiOperation({ summary: '소셜링 상세 조회' })
  @ApiResponse({ type: SocialProfileResponse })
  @ApiNotFoundResponse({ description: SOCIAL_ERRORS.SOCIAL_NOT_FOUND })
  async getSocialProfile(
    @Param('socialId', ParseUUIDPipe) socialId: string,
  ): Promise<SocialProfileResponse> {
    const socialGroup = await this.socialService.getSocialProfile(socialId);
    console.log(socialGroup);
    return new SocialProfileResponse({
      ...socialGroup,
      members: socialGroup.members.map(
        (member) =>
          new SocialMemberProfileResponse({
            ...member,
            ...member.user,
          }),
      ),
    });
  }

  @Get(':socialId/invite-requests')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '소셜링 초대 요청 목록 조회' })
  @ApiNotFoundResponse({ description: SOCIAL_ERRORS.SOCIAL_NOT_FOUND })
  @ApiNotFoundResponse({ description: USER_ERRORS.USER_NOT_FOUND })
  @ApiBadRequestResponse({
    description: SOCIAL_ERRORS.SOCIAL_USER_IS_NOT_ADMIN,
  })
  @ApiResponse({ type: UserProfileResponse, isArray: true })
  @ApiBearerAuth()
  async getSocialInviteRequestList(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<SocialMemberProfileResponse[]> {
    const members = await this.socialService.getSocialInviteRequestList(
      socialId,
      user,
    );
    return members.map(
      (member) =>
        new SocialMemberProfileResponse({
          ...member,
          ...member.user,
        }),
    );
  }

  @Post(':socialId/join')
  @ApiOperation({ summary: '소셜링 가입' })
  @ApiResponse({ type: Boolean })
  @ApiNotFoundResponse({ description: SOCIAL_ERRORS.SOCIAL_NOT_FOUND })
  @ApiNotFoundResponse({ description: USER_ERRORS.USER_NOT_FOUND })
  @ApiBadRequestResponse({ description: SOCIAL_ERRORS.HAVE_TO_REQUEST_JOIN })
  @ApiConflictResponse({
    description: SOCIAL_ERRORS.SOCIAL_REQUEST_ALREADY_EXIST,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async joinSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.joinSocial({ socialId, user });
  }

  @Post()
  @ApiOperation({ summary: '소셜링 생성' })
  @UseGuards(JwtAuthGuard)
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
  @ApiBadRequestResponse({
    description: USER_ERRORS.USER_NOT_FOUND,
  })
  @ApiBadRequestResponse({ description: SOCIAL_ERRORS.SOCIAL_PLACE_NOT_FOUND })
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
          new SocialMemberProfileResponse({
            ...member,
            ...member.user,
          }),
      ),
    });
  }

  @Post(':socialId/comment')
  @ApiOperation({ summary: '소셜링 댓글 생성 | 🐥 개발중' })
  async createSocialComment() {
    return;
  }

  @Post(':socialId/request-invite')
  @ApiOperation({ summary: '소셜링 초대 신청' })
  @ApiResponse({ type: Boolean })
  @ApiNotFoundResponse({ description: SOCIAL_ERRORS.SOCIAL_NOT_FOUND })
  @ApiBadRequestResponse({
    description: [
      SOCIAL_ERRORS.DONT_HAVE_TO_REQUEST,
      SOCIAL_ERRORS.SOCIAL_ADMIN_CANT_REQUEST_INVITE,
    ].join(', '),
  })
  @ApiConflictResponse({
    description: SOCIAL_ERRORS.SOCIAL_REQUEST_ALREADY_EXIST,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async requestInviteSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.requestInviteSocial({ socialId, user });
  }

  @Post(':socialId/accept-invite/:userId')
  @ApiOperation({ summary: '소셜링 초대 수락' })
  @ApiResponse({ type: Boolean })
  @ApiNotFoundResponse({
    description: [
      SOCIAL_ERRORS.SOCIAL_NOT_FOUND,
      USER_ERRORS.USER_NOT_FOUND,
      SOCIAL_ERRORS.SOCIAL_REQUEST_NOT_FOUND,
    ].join(', '),
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async acceptInviteSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.acceptInviteSocial({
      socialId,
      userId,
      user,
    });
  }

  @Delete(':socialId/leave')
  @ApiOperation({ summary: '소셜링 탈퇴' })
  @ApiResponse({ type: Boolean })
  @ApiNotFoundResponse({ description: SOCIAL_ERRORS.SOCIAL_NOT_FOUND })
  @ApiConflictResponse({
    description: SOCIAL_ERRORS.SOCIAL_CANT_LEAVE_AT_NOT_JOIN,
  })
  @ApiBadRequestResponse({ description: SOCIAL_ERRORS.SOCIAL_ADMIN_CANT_LEAVE })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async leaveSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.leaveSocial(socialId, user);
  }

  @Post(':socialId/kick/:userId')
  @ApiOperation({ summary: '소셜링 추방' })
  @ApiResponse({ type: Boolean })
  @ApiNotFoundResponse({
    description: [
      SOCIAL_ERRORS.SOCIAL_USER_NOT_FOUND_EXCEPTION,
      USER_ERRORS.USER_NOT_FOUND,
    ].join(', '),
  })
  @ApiBadRequestResponse({
    description: [
      SOCIAL_ERRORS.SOCIAL_USER_IS_NOT_ADMIN,
      SOCIAL_ERRORS.SOCIAL_CANT_KICK_ADMIN,
    ].join(', '),
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async kickSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.kickSocial(socialId, userId, user);
  }

  @Post(':socialId/report')
  @ApiOperation({ summary: '소셜링 신고 | 🐥 기획 나오면 개발 진행' })
  @ApiResponse({ type: Boolean })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async reportSocial(): // @Param('socialId', ParseUUIDPipe) socialId: string, // @Req() { user }: Request,
  Promise<boolean> {
    return;
  }

  @Patch(':socialId')
  @ApiOperation({ summary: '소셜링 수정' })
  @ApiBody({ type: SocialUpdateRequest })
  @ApiResponse({ type: SocialProfileResponse })
  @ApiNotFoundResponse({
    description: [
      SOCIAL_ERRORS.SOCIAL_NOT_FOUND,
      USER_ERRORS.USER_NOT_FOUND,
    ].join(', '),
  })
  @ApiBadRequestResponse({
    description: SOCIAL_ERRORS.SOCIAL_USER_IS_NOT_ADMIN,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
          new SocialMemberProfileResponse({
            ...member,
            ...member.user,
          }),
      ),
    });
  }
}
