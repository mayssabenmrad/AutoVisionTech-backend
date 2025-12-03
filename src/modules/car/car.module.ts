import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { UploadModule } from '../upload/upload.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './car.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [UploadModule, TypeOrmModule.forFeature([CarEntity, User])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
