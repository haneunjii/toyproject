import { SocialProfileResponseCommand } from '@app/community/social/commands/social.commands';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';
import {
  SocialGroupPlaceProperties,
  SocialGroupType,
  SocialRecruitmentConditions,
} from '@domain/social/social-group';
import { UserProperties } from '@domain/user/user';

export class SocialProfileResponse implements SocialProfileResponseCommand {
  id: string;
  title: string;
  type: SocialGroupType;
  thumbnailUrl: string;
  likeCount: number;
  memberCount: number;
  admin: UserProperties;
  endAt: Date;
  socialAt: Date;
  needApprove: boolean;
  isOffline: boolean;
  socialPlace: SocialGroupPlaceProperties;
  ownerProfile: UserProfileResponse;
  members: UserProfileResponse[];
  recruitmentConditions: SocialRecruitmentConditions;

  constructor(social: SocialProfileResponseCommand) {
    Object.assign(this, social);
    this.ownerProfile = new UserProfileResponse({
      ...social.admin,
      ...social.admin.profile,
    });
    this.members = social.members.map((member) => {
      return new UserProfileResponse({
        ...member,
      });
    });
  }
}
