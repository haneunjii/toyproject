import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserToDoProperties } from '@domain/user/user';
import { User } from '@domain/user/user.entity';

@Entity('user_todos')
export class UserTodo implements UserToDoProperties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column()
  content: string;

  @Column({ type: 'boolean', default: false })
  isPublish: boolean;

  @ManyToOne(() => User, (user) => user)
  author: User;

  @Column({ type: 'date' })
  endAt: Date;

  @Column({ type: 'boolean', default: false })
  isDone: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
