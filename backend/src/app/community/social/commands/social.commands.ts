import {
  SocialGroupPlaceProperties,
  SocialGroupProperties,
} from '@domain/social/social-group';

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
