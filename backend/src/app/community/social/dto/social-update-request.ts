import { SocialUpdateRequestCommand } from '@app/community/social/commands/social.commands';
import { SocialGroupType } from '@domain/social/social-group';
import { SocialGroupPlace } from '@domain/social/social-group-place.entity';
import { SocialGroupRecruitmentConditions } from '@domain/social/social-group-recruitment-conditions.entity';

export class SocialUpdateRequest implements SocialUpdateRequestCommand {
  title?: string;
  content?: string;
  recruitment?: number;
  type?: SocialGroupType;
  recruitmentConditions?: SocialGroupRecruitmentConditions;
  thumbnailUrl?: string;
  needApprove?: boolean;
  endAt?: Date;
  socialPlace?: SocialGroupPlace;
  isOffline?: boolean;
  socialAt?: Date;
}
