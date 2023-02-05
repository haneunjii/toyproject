import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PostProperties } from '@domain/post/post';
import { PostCategory } from '@domain/post/post-category.entity';
import { PostComment } from '@domain/post/post-comment.entity';
import { PostLike } from '@domain/post/post-like.entity';
import { User } from '@domain/user/user.entity';

@Entity('posts')
export class Post implements PostProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user)
  author: User;

  @OneToMany(() => PostLike, (postLike) => postLike)
  likes: PostLike[];

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @ManyToOne(() => PostCategory, (postCategory) => postCategory)
  type: PostCategory;

  @OneToMany(() => PostComment, (postComment) => postComment)
  comments: PostComment[];

  @Column({ type: 'int', default: 0 })
  commentCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
