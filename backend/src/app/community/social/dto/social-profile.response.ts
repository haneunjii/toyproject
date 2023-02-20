import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

import { SocialProfileResponseCommand } from '@app/community/social/commands/social.commands';
import { SocialMemberProfileResponse } from '@app/community/social/dto/social-member-profile.response';
import {
  SocialGroupPlaceProperties,
  SocialGroupType,
  SocialRecruitmentConditions,
} from '@domain/social/social-group';
import { UserProperties } from '@domain/user/user';

export class SocialProfileResponse implements SocialProfileResponseCommand {
  @ApiProperty({ description: '소셜그룹 아이디' })
  @IsUUID('4')
  id: string;

  @ApiProperty({ description: '소셜그룹 제목' })
  @IsString()
  title: string;

  @ApiProperty({
    description: '소셜 카테고리',
    enum: SocialGroupType,
  })
  @IsEnum(SocialGroupType)
  type: SocialGroupType;

  @ApiProperty({ description: '썸네일 링크' })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({ description: '좋아요 수' })
  @IsNumber()
  likeCount: number;

  @ApiProperty({ description: '현재 참여자 수' })
  @IsNumber()
  memberCount: number;

  @ApiProperty({ description: '소셜그룹 관리자' })
  admin: UserProperties;

  @ApiProperty({ description: '모집 마감' })
  @IsDate()
  endAt: Date;

  @ApiProperty({ description: '소셜 시작일' })
  @IsDate()
  socialAt: Date;

  @ApiProperty({ description: '참여 신청제 여부' })
  @IsBoolean()
  needApprove: boolean;

  @ApiProperty({ description: '오프라인 여부' })
  @IsBoolean()
  isOffline: boolean;

  @ApiProperty({ description: '소셜링 모집 지역' })
  socialPlace: SocialGroupPlaceProperties;

  @ApiProperty({ description: '소셜그룹 소개' })
  @IsArray()
  members: SocialMemberProfileResponse[];

  @ApiProperty({
    description: '소셜 모집 제한',
  })
  recruitmentConditions: SocialRecruitmentConditions;

  constructor(social: SocialProfileResponseCommand) {
    Object.assign(this, social);
    this.members = social.members.map((member) => {
      return new SocialMemberProfileResponse(member);
    });
  }
}
