import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

import { SocialPreviewResponseCommand } from '@app/community/social/commands/social.commands';
import { SocialGroupType } from '@domain/social/social-group';
import { UserProperties } from '@domain/user/user';

export class SocialPreviewResponse implements SocialPreviewResponseCommand {
  @ApiProperty({ description: '소셜그룹 아이디' })
  @IsUUID('4')
  id: string;

  @ApiProperty({ description: '소셜그룹 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '소셜그룹 관리자' })
  admin: UserProperties;

  @ApiProperty({ description: '모집 마감일' })
  @IsDate()
  endAt: Date;

  @ApiProperty({ description: '썸네일 제목' })
  @IsUrl()
  thumbnailUrl: string;

  @ApiProperty({
    description: '소셜 카테고리',
    enum: SocialGroupType,
  })
  @IsEnum(SocialGroupType)
  type: SocialGroupType;

  @ApiProperty({ description: '좋아요 수' })
  @IsNumber()
  likeCount: number;

  @ApiProperty({ description: '현재 참여자 수' })
  @IsNumber()
  memberCount: number;

  @ApiProperty({ description: '소셜 시작일' })
  @IsDate()
  socialAt: Date;

  @ApiProperty({ description: '소셜링 모집 지역' })
  @IsString()
  region3DepthName: string;

  constructor(date: SocialPreviewResponseCommand) {
    Object.assign(this, date);
  }
}
