import { IsUrl } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  SocialGroupProperties,
  SocialGroupType,
} from '@domain/social/social-group';
import { SocialGroupPlace } from '@domain/social/social-group-place.entity';
import { SocialGroupUser } from '@domain/social/social-group-user.entity';
import { User } from '@domain/user/user.entity';

@Entity('social_groups')
export class SocialGroup implements SocialGroupProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user)
  admin: User;

  @Column()
  recruitment: number;

  @OneToMany(() => SocialGroupUser, (socialGroupUser) => socialGroupUser)
  members: SocialGroupUser[];

  @Column({ type: 'enum', enum: SocialGroupType })
  type: SocialGroupType;

  @Column()
  @IsUrl()
  thumbnailUrl: string;

  @Column({ type: 'boolean', default: false })
  needApprove: boolean;

  @Column({ type: 'date' })
  endAt: Date;

  @OneToMany(() => User, (user) => user)
  likes: User[];

  @OneToOne(() => SocialGroupPlace, (socialGroupPlace) => socialGroupPlace, {
    cascade: ['insert', 'soft-remove'],
  })
  @JoinColumn()
  socialPlace: SocialGroupPlace;

  @Column({ type: 'timestamptz' })
  socialAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
