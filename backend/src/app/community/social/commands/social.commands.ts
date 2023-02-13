import { SocialCreateRequest } from '@app/community/social/dto/social-create.request';
import { UserProfileCommand } from '@app/user/user.commands';
import {
  SocialGroupPlaceProperties,
  SocialGroupProperties,
} from '@domain/social/social-group';

export type SocialListQuery = {
  page: number;
  limit: number;
};

export type SocialPreviewResponseCommand = Pick<
  SocialGroupProperties,
  | 'id'
  | 'title'
  | 'endAt'
  | 'thumbnailUrl'
  | 'type'
  | 'likeCount'
  | 'memberCount'
  | 'socialAt'
> &
  Pick<SocialGroupPlaceProperties, 'region3DepthName'>;

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
> & { members: UserProfileCommand[] };

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
