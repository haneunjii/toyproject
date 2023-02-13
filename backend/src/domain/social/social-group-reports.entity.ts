import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  SocialGroupReportEnum,
  SocialGroupReportProperties,
} from '@domain/social/social-group';
import { SocialGroupReportLogs } from '@domain/social/social-group-report-logs.entity';

@Entity('social_group_reports')
export class SocialGroupReports implements SocialGroupReportProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ type: 'enum', enum: SocialGroupReportEnum })
  SocialGroupReport: SocialGroupReportEnum;

  @ManyToOne(
    () => SocialGroupReportLogs,
    (socialGroupReportLog) => socialGroupReportLog,
  )
  socialGroupReportLog: SocialGroupReportLogs;
}
