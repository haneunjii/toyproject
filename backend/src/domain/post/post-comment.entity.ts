import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PostCommentProperties } from '@domain/post/post';
import { Post } from '@domain/post/post.entity';
import { User } from '@domain/user/user.entity';

@Entity('post_comments')
export class PostComment implements PostCommentProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user)
  author: User;

  @ManyToOne(() => Post, (post) => post)
  post: Post;

  @ManyToOne(() => PostComment, (postComment) => postComment, {
    nullable: true,
  })
  parentComment: PostComment | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
