import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { ReservationEntity } from './reservation.entity';
import { CarEntity } from '../car/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationEntity, CarEntity])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
