import { ApiProperty } from '@nestjs/swagger';

import { SocialUpdateRequestCommand } from '@app/community/social/commands/social.commands';
import { SocialGroupType } from '@domain/social/social-group';
import { SocialGroupPlace } from '@domain/social/social-group-place.entity';
import { SocialGroupRecruitmentConditions } from '@domain/social/social-group-recruitment-conditions.entity';

export class SocialUpdateRequest implements SocialUpdateRequestCommand {
  @ApiProperty({
    example: '소셜 그룹 이름',
  })
  title?: string;

  @ApiProperty({
    example: '소셜 그룹 내용',
  })
  content?: string;

  @ApiProperty({
    example: 12,
  })
  recruitment?: number;

  @ApiProperty({
    enum: SocialGroupType,
    example: SocialGroupType.DANCE,
  })
  type?: SocialGroupType;

  @ApiProperty({
    example: {
      maxAge: 50,
      minAge: 20,
      onlyMale: false,
      onlyFemale: false,
    },
  })
  recruitmentConditions?: SocialGroupRecruitmentConditions;

  @ApiProperty({
    example: 'https://thumbnail.url',
  })
  thumbnailUrl?: string;

  @ApiProperty({
    example: false,
  })
  needApprove?: boolean;

  @ApiProperty({
    example: new Date(),
  })
  endAt?: Date;

  @ApiProperty({
    example: {
      buildingName: '빌딩 이름',
      latitude: 37.123456,
      longitude: 127.123456,
      placeAddress: '상세 주소',
      region1DepthName: '시/도',
      region2DepthName: '시/군/구',
      region3DepthName: '동/읍/면',
    },
  })
  socialPlace?: SocialGroupPlace;

  @ApiProperty({
    example: true,
  })
  isOffline?: boolean;

  @ApiProperty({
    example: new Date(),
  })
  socialAt?: Date;
}
