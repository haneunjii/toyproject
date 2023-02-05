import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { UserFollowProperties } from '@domain/user/user';
import { User } from '@domain/user/user.entity';

@Entity('user_follow')
export class UserFollow implements UserFollowProperties {
  @PrimaryColumn('uuid')
  id: string;

  @PrimaryColumn('uuid')
  followingId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId', referencedColumnName: 'id' })
  following: User;

  @CreateDateColumn()
  createdAt: Date;
}
