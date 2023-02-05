import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserAddressProperties } from '@domain/user/user';
import { User } from '@domain/user/user.entity';

@Entity('user_address')
export class UserAddress implements UserAddressProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.addressInfo, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Column()
  region1DepthName: string; //시,도

  @Column()
  region2DepthName: string; //구, 군

  @Column()
  region3DepthName: string; //동, 면, 읍

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
