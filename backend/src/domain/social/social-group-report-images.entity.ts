import { IsUrl } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SocialGroupReportImagesProperties } from '@domain/social/social-group';
import { SocialGroupReportLogs } from '@domain/social/social-group-report-logs.entity';

@Entity('social_group_report_images')
export class SocialGroupReportImages
  implements SocialGroupReportImagesProperties
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsUrl()
  url: string;

  @ManyToOne(
    () => SocialGroupReportLogs,
    (socialGroupReportLog) => socialGroupReportLog.reportImages,
  )
  socialGroupReportLog: SocialGroupReportLogs;
}
