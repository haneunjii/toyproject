import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PostComment } from '@domain/post/post-comment.entity';
import { Post } from '@domain/post/post.entity';
import { SocialGroupReportLogs } from '@domain/social/social-group-report-logs.entity';
import { SocialGroupUser } from '@domain/social/social-group-user.entity';
import { UserProperties } from '@domain/user/user';
import { UserAddress } from '@domain/user/user-address.entity';
import { UserProfile } from '@domain/user/user-profile.entity';
import { UserSns } from '@domain/user/user-sns.entity';
import { UserTodo } from '@domain/user/user-todo.entity';
import { UserFollow } from '@domain/user/user.follow.entity';

@Entity('users')
export class User implements UserProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  nickname: string;

  @OneToOne(() => UserSns, (userSns) => userSns)
  @JoinColumn()
  authType: UserSns;

  @OneToMany(() => UserProfile, (userProfile) => userProfile)
  follow: UserFollow[];

  @OneToMany(() => Post, (post) => post)
  posts: Post[];

  @OneToMany(() => PostComment, (postComment) => postComment)
  comments: PostComment[];

  @OneToOne(() => UserProfile, (userProfile) => userProfile, {
    cascade: ['insert', 'soft-remove'],
  })
  @JoinColumn()
  profile: UserProfile;

  @OneToMany(() => UserTodo, (userTodo) => userTodo)
  toDoList: UserTodo[];

  @OneToMany(() => UserFollow, (follow) => follow.user)
  followings: UserFollow[];

  @OneToMany(() => UserFollow, (follow) => follow.following)
  followers: UserFollow[];

  @OneToMany(() => SocialGroupUser, (socialGroupUser) => socialGroupUser)
  socialGroups: SocialGroupUser[];

  @OneToOne(() => UserAddress, (userAddress) => userAddress)
  @JoinColumn()
  addressInfo: UserAddress;

  @OneToMany(() => SocialGroupReportLogs, (reportLogs) => reportLogs)
  reportLogs: SocialGroupReportLogs[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
