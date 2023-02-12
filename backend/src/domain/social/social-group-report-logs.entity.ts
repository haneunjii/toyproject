import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SocialGroupReportLogsProperties } from '@domain/social/social-group';
import { SocialGroupReportImages } from '@domain/social/social-group-report-images.entity';
import { SocialGroup } from '@domain/social/social-group.entity';
import { User } from '@domain/user/user.entity';

@Entity('social_group_report_logs')
export class SocialGroupReportLogs implements SocialGroupReportLogsProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reportLogs)
  user: User;

  @ManyToOne(() => SocialGroup, (socialGroup) => socialGroup.reportLogs)
  socialGroup: SocialGroup;

  @Column()
  reason: string;

  @OneToMany(
    () => SocialGroupReportImages,
    (reportImage) => reportImage.socialGroupReportLog,
  )
  reportImages: SocialGroupReportImages[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
