import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('socials')
export class SocialController {
  //TODO: 소셜링 구현

  @Get()
  async getSocials(): Promise<void> {
    return;
  }

  @Get(':socialId')
  async getSocialProfile(): Promise<void> {
    return;
  }

  @Get(':socialId/invite-requests')
  async getSocialInviteRequests(): Promise<void> {
    return;
  }

  @Post()
  async createSocial(): Promise<void> {
    return;
  }

  @Post('join/:socialId')
  async joinSocial(): Promise<void> {
    return;
  }

  @Post(':socialId/invite-requests')
  async createSocialInviteRequest(): Promise<void> {
    return;
  }

  @Post('leave/:socialId')
  async leaveSocial(): Promise<void> {
    return;
  }

  @Post('kick/:socialId')
  async kickSocial(): Promise<void> {
    return;
  }

  @Patch(':socialId')
  async updateSocial(): Promise<void> {
    return;
  }

  @Delete(':socialId')
  async deleteSocial(): Promise<void> {
    return;
  }
}
