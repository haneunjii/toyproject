import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SocialGroupPlaceProperties } from '@domain/social/social-group';
import { SocialGroup } from '@domain/social/social-group.entity';

@Entity('social_groups_place')
export class SocialGroupPlace implements SocialGroupPlaceProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => SocialGroup, (socialGroup) => socialGroup.socialPlace, {
    onDelete: 'CASCADE',
  })
  socialGroup: SocialGroup;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  placeAddress: string;

  @Column()
  region1DepthName: string;

  @Column()
  region2DepthName: string;

  @Column()
  region3DepthName: string;

  @Column({ nullable: true })
  buildingName: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
