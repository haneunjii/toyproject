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
  isOffline: boolean;
  endAt: Date;
  // hasEntryFee: boolean;
  // entryFee?: number;
  socialAt: Date;
  socialPlace?: SocialGroupPlaceProperties;
  likes: UserProperties[];
  likeCount?: number;
  recruitmentConditions: SocialRecruitmentConditions;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export type SocialGroupPlaceProperties = {
  id: string;
  socialGroup: SocialGroupProperties;
  buildingName: string | null;
  latitude: string;
  longitude: string;
  placeAddress: string;
  region1DepthName: string;
  region2DepthName: string;
  region3DepthName: string;
};

export type SocialGroupMembersProperties = {
  id: string;
  socialGroup: SocialGroupProperties;
  user: UserProperties;
  userStatus: SocialGroupMemberStatus;
  userRole: SocialGroupMemberRole;
};

export type SocialRecruitmentConditions = {
  id: string;
  socialGroup: SocialGroupProperties;
  minAge: number;
  maxAge: number;
  onlyMale: boolean;
  onlyFemale: boolean;
};

export type SocialGroupReportLogsProperties = {
  id: string;
  user: UserProperties;
  reason: string;
  reportUrls?: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type SocialGroupReport = {
  id: string;
  SocialGroupReport: SocialGroupReportEnum;
  socialGroup: SocialGroupProperties;
  user: UserProperties;
};

export enum SocialGroupReportEnum {
  SPAM = '특정 제품, 서비스, 사무임 단순 홍보',
  ADULT = '성적인 내용',
  CALL = '전화번호, 이메일, SNS 등 개인정보 요구',
  HATE = '인종, 성별, 성적 지향, 종교적 신념 등을 비하하는 내용',
  ETC = '기타',
}

export enum SocialGroupMemberStatus {
  WAITING = '대기',
  JOINED = '참여',
  EXITED = '탈퇴',
  KICKED = '강퇴',
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
