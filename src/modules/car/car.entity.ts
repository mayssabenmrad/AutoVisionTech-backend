import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/modules/user/user.entity';
import { CommentEntity } from '../comment/comment.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
@Entity('cars')
export class CarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  brand: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: false })
  model: string;

  @Column({ nullable: false, type: 'int' })
  year: number;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: false, type: 'int' })
  kilometerAge: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['available', 'reserved', 'sold'],
    default: 'available',
  })
  status: string;

  @Column({ nullable: false })
  condition: string;

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  images: string[];

  @Column({ type: 'text', array: true, nullable: true, default: [] })
  features: string[];

  @ManyToOne(() => User, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CommentEntity, (comment) => comment.car)
  comments: CommentEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.car)
  reservations: ReservationEntity[];
}
