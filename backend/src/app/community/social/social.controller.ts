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
} from '@nestjs/common';

import { SocialCreateRequest } from '@app/community/social/dto/social-create.request';
import { SocialPreviewResponse } from '@app/community/social/dto/social-preview.response';
import { SocialProfileResponse } from '@app/community/social/dto/social-profile.response';
import { SocialUpdateRequest } from '@app/community/social/dto/social-update-request';
import { SocialService } from '@app/community/social/social.service';
import { Pagination } from '@app/infrastructure/types/pagination.types';
import { Request } from '@app/infrastructure/types/request.types';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';

@Controller('socials')
export class SocialController {
  //TODO: 소셜링 구현
  constructor(private readonly socialService: SocialService) {}

  @Get()
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
  async createSocial(
    body: SocialCreateRequest,
    @Req() { user }: Request,
  ): Promise<SocialProfileResponse> {
    const socialGroup = await this.socialService.createSocial(body, user);
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
  async joinSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.joinSocial(socialId, user);
  }

  @Post(':socialId/request-invite')
  async requestInviteSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.requestInviteSocial(socialId, user);
  }

  @Post(':socialId/leave')
  async leaveSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.leaveSocial(socialId, user);
  }

  @Post(':socialId/kick/:userId')
  async kickSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.kickSocial(socialId, userId, user);
  }

  @Post(':socialId/report')
  async reportSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return;
  }

  @Patch(':socialId')
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
  async deleteSocial(
    @Param('socialId', ParseUUIDPipe) socialId: string,
    @Req() { user }: Request,
  ): Promise<boolean> {
    return await this.socialService.deleteSocial(socialId, user);
  }
}
