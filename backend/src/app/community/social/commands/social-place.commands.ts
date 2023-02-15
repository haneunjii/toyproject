import { SocialGroupPlaceProperties } from '@domain/social/social-group';

export type SocialPlaceCreateRequestCommand = Pick<
  SocialGroupPlaceProperties,
  | 'buildingName'
  | 'latitude'
  | 'longitude'
  | 'placeAddress'
  | 'region1DepthName'
  | 'region2DepthName'
  | 'region3DepthName'
>;
