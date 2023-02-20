import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsUUID } from 'class-validator';

import { SocialMemberProfileCommand } from '@app/user/user.commands';
import {
  SocialGroupMemberRole,
  SocialGroupMemberStatus,
} from '@domain/social/social-group';

export class SocialMemberProfileResponse implements SocialMemberProfileCommand {
  @ApiProperty({ description: '소셜링 멤버 ID' })
  @IsUUID('4')
  id: string;

  @ApiProperty({ example: '소셜링 멤버 username' })
  @IsString()
  username: string;

  @ApiProperty({ example: '소셜링 멤버 nickname' })
  @IsString()
  nickname: string;

  @ApiProperty({ example: '', description: '소셜링 멤버 프로필 이미지' })
  @IsUrl()
  profileImageUrl: string;

  @ApiProperty({
    description: '소셜링 멤버 상태',
    enum: SocialGroupMemberStatus,
    default: SocialGroupMemberStatus.JOINED,
  })
  userStatus: SocialGroupMemberStatus;

  @ApiProperty({
    description: '소셜링 멤버 권한',
    enum: SocialGroupMemberRole,
    default: SocialGroupMemberRole.MEMBER,
  })
  userRole: SocialGroupMemberRole;

  constructor(data: SocialMemberProfileCommand) {
    this.id = data.id;
    this.username = data.username;
    this.nickname = data.nickname;
    this.profileImageUrl = data.profileImageUrl;
    this.userStatus = data.userStatus;
    this.userRole = data.userRole;
  }
}
