import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { PostLikeProperties } from '@domain/post/post';
import { Post } from '@domain/post/post.entity';
import { User } from '@domain/user/user.entity';

@Entity('post_likes')
@Unique(['user', 'post'])
export class PostLike implements PostLikeProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user)
  user: User;

  @ManyToOne(() => Post, (post) => post)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
