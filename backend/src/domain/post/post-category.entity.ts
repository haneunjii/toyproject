import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PostCategoryProperties, PostType } from '@domain/post/post';

@Entity('post_category')
export class PostCategory implements PostCategoryProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PostType })
  title: PostType;
}
