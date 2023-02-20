import { Length } from 'class-validator';
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

import { UserProfileProperties } from '@domain/user/user';
import { User } from '@domain/user/user.entity';

@Entity('user_profile')
export class UserProfile implements UserProfileProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  followerCount: number;

  @Column({ type: 'int', default: 0 })
  followingCount: number;

  @Column({ type: 'text', default: '' })
  @Length(0, 200)
  introduction: string;

  @Column({ type: 'decimal', default: 36.5 })
  mannerTemperature: number;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
