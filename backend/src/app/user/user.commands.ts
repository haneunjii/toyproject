import {
  UserProfileProperties,
  UserProperties,
  UserSNSProperties,
} from '@domain/user/user';
import { UserAddress } from '@domain/user/user-address.entity';

export type UserCreateRequestCommand = {
  user: Pick<UserProperties, 'username' | 'nickname'>;
} & { authType: Pick<UserSNSProperties, 'snsType' | 'oauthId'> } & {
  profile: Partial<Pick<UserProfileProperties, 'profileImageUrl'>>;
};

export type UserAddressUpdateRequestCommand = Pick<
  UserAddress,
  'latitude' | 'longitude'
>;

export type UserAddressResponseCommand = Pick<
  UserAddress,
  'region1DepthName' | 'region2DepthName' | 'region3DepthName'
>;

export type UserProfileCommand = Pick<
  UserProperties,
  'id' | 'username' | 'nickname'
>;
