import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserSNS, UserSNSProperties } from '@domain/user/user';
import { User } from '@domain/user/user.entity';

@Entity('user_sns')
export class UserSns implements UserSNSProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => User, (user) => user.id)
  users: User[];

  @Column()
  oauthId: string;

  @Column({ type: 'enum', enum: UserSNS, unique: true })
  snsType: UserSNS;
}
