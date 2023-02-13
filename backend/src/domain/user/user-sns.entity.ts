import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserOauthType } from '@domain/user/oauth-type.entity';
import { UserSnsProperties } from '@domain/user/user';
import { User } from '@domain/user/user.entity';

@Entity('user_sns')
export class UserSns implements UserSnsProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @OneToMany(() => UserOauthType, (userOauthType) => userOauthType)
  userOauthTypes: UserOauthType[];
}
