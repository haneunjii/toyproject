import { UserProperties } from '@domain/user/user';

export type SocialGroupProperties = {
  id: string;
  title: string;
  content: string;
  admin: UserProperties;
  recruitment: number;
  members: SocialGroupMembersProperties[];
  memberCount?: number;
  type: SocialGroupType;
  thumbnailUrl: string;
  needApprove: boolean;
  endAt: Date;
  likes: UserProperties[];
  likeCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export type SocialGroupMembersProperties = {
  id: string;
  socialGroup: SocialGroupProperties;
  user: UserProperties;
  userStatus: SocialGroupMemberStatus;
  userRole: SocialGroupMemberRole;
};

export enum SocialGroupMemberStatus {
  WAITING = '대기',
  JOINED = '참여',
  EXITED = '탈퇴',
}

export enum SocialGroupMemberRole {
  ADMIN = '주최자',
  MEMBER = '멤버',
}

export enum SocialGroupType {
  EXERCISE = '운동',
  SINGING = '노래',
  DANCE = '춤',
  BUSINESS = '재테크',
  CERTIFICATE = '자격증',
  LANGUAGE = '외국어',
  STUDYING = '공부',
  READING = '독서',
  WRITING = '글쓰기',
  PORTFOLIO = '포트폴리오',
  ETC = '자유',
}
