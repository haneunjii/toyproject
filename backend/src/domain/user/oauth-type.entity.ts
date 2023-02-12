import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserOauthTypeProperties, UserSNS } from '@domain/user/user';
import { UserSns } from '@domain/user/user-sns.entity';

@Entity('oauth_types')
export class UserOauthType implements UserOauthTypeProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @PrimaryColumn({ type: 'enum', enum: UserSNS, unique: true })
  snsType: UserSNS;

  @ManyToOne(() => UserSns, (userSns) => userSns)
  userSNS: UserSns;
}
