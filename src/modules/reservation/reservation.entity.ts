import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarEntity } from '../car/car.entity';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  clientName: string;

  @Column({ nullable: false })
  clientEmail: string;

  @Column({ nullable: false })
  clientPhone: string;

  @Column({ type: 'date', nullable: false })
  visitDate: Date;

  @Column({ type: 'time', nullable: false })
  visitTime: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  })
  status: string;

  @ManyToOne(() => CarEntity, (car) => car.reservations, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'carId' })
  car: CarEntity;

  @Column({ nullable: false })
  carId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
