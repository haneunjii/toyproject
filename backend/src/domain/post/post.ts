import { UserProperties } from '@domain/user/user';

export type PostProperties = {
  id: string;
  title: string;
  content: string;
  type: PostCategoryProperties;
  author: UserProperties;
  likes: PostLikeProperties[];
  likeCount: number;
  comments: PostCommentProperties[];
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type PostLikeProperties = {
  user: UserProperties;
  post: PostProperties;
};

export type PostCommentProperties = {
  id: string;
  author: UserProperties;
  post: PostProperties;
  parentComment: PostCommentProperties;
  content: string;
};

export type PostCategoryProperties = {
  id: string;
  title: PostType;
};

export enum PostType {
  QUESTION = '질문',
  GROWTH = '자기계발',
  FREE = '자유',
  ETC = 'ETC',
}
