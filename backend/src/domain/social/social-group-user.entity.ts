import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import {
  SocialGroupMemberRole,
  SocialGroupMembersProperties,
  SocialGroupMemberStatus,
} from '@domain/social/social-group';
import { SocialGroup } from '@domain/social/social-group.entity';
import { User } from '@domain/user/user.entity';

@Entity('social_group_users')
export class SocialGroupUser implements SocialGroupMembersProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SocialGroup, (socialGroup) => socialGroup)
  socialGroup: SocialGroup;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @Column({ type: 'enum', enum: SocialGroupMemberStatus })
  userStatus: SocialGroupMemberStatus;

  @Column({ type: 'enum', enum: SocialGroupMemberRole })
  userRole: SocialGroupMemberRole;
}
