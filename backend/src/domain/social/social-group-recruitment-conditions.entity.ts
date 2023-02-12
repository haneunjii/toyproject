import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import {
  SocialGroupProperties,
  SocialRecruitmentConditions,
} from '@domain/social/social-group';
import { SocialGroup } from '@domain/social/social-group.entity';

@Entity('social_recruitment_conditions')
export class SocialGroupRecruitmentConditions
  implements SocialRecruitmentConditions
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  maxAge: number;

  @Column()
  minAge: number;

  @Column({ type: 'boolean', default: false })
  onlyFemale: boolean;

  @Column({ type: 'boolean', default: false })
  onlyMale: boolean;

  @OneToOne(
    () => SocialGroup,
    (socialGroup) => socialGroup.recruitmentConditions,
  )
  socialGroup: SocialGroupProperties;
}
