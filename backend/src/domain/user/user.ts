import { PostCommentProperties, PostProperties } from '@domain/post/post';
import { SocialGroupMembersProperties } from '@domain/social/social-group';

export type UserProperties = {
  id: string;
  username: string;
  nickname: string;
  authType: UserSNSProperties;
  posts: PostProperties[];
  comments: PostCommentProperties[];
  profile: UserProfileProperties;
  toDoList: UserToDoProperties[];
  followings: UserFollowProperties[];
  followers: UserFollowProperties[];
  socialGroups: SocialGroupMembersProperties[];
  addressInfo: UserAddressProperties;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export type UserProfileProperties = {
  id: string;
  profileImageUrl: string;
  followerCount: number;
  followingCount: number;
  mannerTemperature: number;
  introduction: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export type UserToDoProperties = {
  id: string;
  title: string;
  content: string;
  author: UserProperties;
  isPublish: boolean;
  isDone: boolean;
  endAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export type UserFollowProperties = {
  user: UserProperties;
  following: UserProperties;
};

export enum UserSNS {
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  GOOGLE = 'GOOGLE',
  ETC = 'ETC',
}

export type UserSNSProperties = {
  id: string;
  users: UserProperties[];
  oauthId: string;
  snsType: UserSNS;
};

export type UserAddressProperties = {
  id: string;
  user: UserProperties;
  longitude: string;
  latitude: string;
  region1DepthName: string; //시,도
  region2DepthName: string; //구, 군
  region3DepthName: string; //동, 면, 읍
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};
