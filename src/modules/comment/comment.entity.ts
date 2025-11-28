import {
  Entity,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CarEntity } from '../car/car.entity';
@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  content: string;

  @Check(`"mark" BETWEEN 1 AND 5`)
  @Column({ nullable: false })
  mark: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => CarEntity, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'carId' })
  car: CarEntity;

  @Column({ nullable: false })
  carId: string;
}
