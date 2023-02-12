import { IsUrl } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  SocialGroupProperties,
  SocialGroupType,
} from '@domain/social/social-group';
import { SocialGroupPlace } from '@domain/social/social-group-place.entity';
import { SocialGroupRecruitmentConditions } from '@domain/social/social-group-recruitment-conditions.entity';
import { SocialGroupReportLogs } from '@domain/social/social-group-report-logs.entity';
import { SocialGroupUser } from '@domain/social/social-group-user.entity';
import { User } from '@domain/user/user.entity';

@Entity('social_groups')
export class SocialGroup implements SocialGroupProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user)
  admin: User;

  @Column()
  recruitment: number;

  @Column({ type: 'int', default: 0 })
  memberCount: number;

  @OneToMany(() => SocialGroupUser, (socialGroupUser) => socialGroupUser)
  members: SocialGroupUser[];

  @Column({ type: 'enum', enum: SocialGroupType })
  type: SocialGroupType;

  @OneToOne(
    () => SocialGroupRecruitmentConditions,
    (socialRecruitmentConditions) => socialRecruitmentConditions,
  )
  @JoinColumn()
  recruitmentConditions: SocialGroupRecruitmentConditions;

  @Column()
  @IsUrl()
  thumbnailUrl: string;

  @Column({ type: 'boolean', default: false })
  needApprove: boolean;

  @Column({ type: 'date' })
  endAt: Date;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @OneToMany(() => User, (user) => user)
  likes: User[];

  @OneToOne(() => SocialGroupPlace, (socialGroupPlace) => socialGroupPlace, {
    cascade: ['insert', 'soft-remove'],
    nullable: true,
  })
  @JoinColumn()
  socialPlace?: SocialGroupPlace | null;

  @OneToMany(() => User, (user) => user)
  reportLogs: SocialGroupReportLogs[];

  @Column({ type: 'boolean' })
  isOffline: boolean;

  @Column({ type: 'timestamptz' })
  socialAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
