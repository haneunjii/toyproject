import { SocialCreateRequest } from '@app/community/social/dto/social-create.request';
import { SocialMemberProfileCommand } from '@app/user/user.commands';
import {
  SocialGroupPlaceProperties,
  SocialGroupProperties,
  SocialGroupType,
} from '@domain/social/social-group';

export type SocialListQuery = {
  page: number;
  limit: number;
  category?: SocialGroupType;
};

export type SocialPreviewResponseCommand = Pick<
  SocialGroupProperties,
  | 'id'
  | 'title'
  | 'admin'
  | 'endAt'
  | 'thumbnailUrl'
  | 'type'
  | 'likeCount'
  | 'memberCount'
  | 'socialAt'
> &
  Partial<Pick<SocialGroupPlaceProperties, 'region3DepthName'>>;

export type SocialProfileResponseCommand = Pick<
  SocialGroupProperties,
  | 'id'
  | 'title'
  | 'type'
  | 'thumbnailUrl'
  | 'likeCount'
  | 'memberCount'
  | 'endAt'
  | 'socialAt'
  | 'needApprove'
  | 'isOffline'
  | 'socialPlace'
  | 'admin'
  | 'recruitmentConditions'
> & { members: SocialMemberProfileCommand[] };

export type SocialCreateRequestCommand = Pick<
  SocialCreateRequest,
  | 'title'
  | 'content'
  | 'recruitment'
  | 'type'
  | 'thumbnailUrl'
  | 'needApprove'
  | 'endAt'
  | 'socialPlace'
  | 'isOffline'
  | 'socialAt'
  | 'recruitmentConditions'
>;

export type SocialUpdateRequestCommand = Partial<SocialCreateRequestCommand>;
