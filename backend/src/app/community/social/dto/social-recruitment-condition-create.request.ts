import { ApiProperty } from '@nestjs/swagger';

import { SocialGroupRecruitmentConditions } from '@domain/social/social-group-recruitment-conditions.entity';

export class SocialRecruitmentConditionCreateRequest
  implements Partial<SocialGroupRecruitmentConditions>
{
  @ApiProperty({ example: 50, description: '최대 나이' })
  maxAge: number;

  @ApiProperty({ example: 20, description: '최소 나이' })
  minAge: number;

  @ApiProperty({ example: false, description: '여자만' })
  onlyFemale: boolean;

  @ApiProperty({ example: false, description: '남자만' })
  onlyMale: boolean;
}
