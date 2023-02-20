import { SocialGroupUser } from '@domain/social/social-group-user.entity';
import { UserOauthTypeProperties, UserProperties } from '@domain/user/user';
import { UserAddress } from '@domain/user/user-address.entity';

export type UserCreateRequestCommand = {
  user: Pick<UserProperties, 'username' | 'nickname' | 'profileImageUrl'>;
} & { authType: Pick<UserOauthTypeProperties, 'username' | 'snsType'> };

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
  'id' | 'username' | 'nickname' | 'profileImageUrl'
>;

export type SocialMemberProfileCommand = UserProfileCommand &
  Pick<SocialGroupUser, 'userStatus' | 'userRole'>;
