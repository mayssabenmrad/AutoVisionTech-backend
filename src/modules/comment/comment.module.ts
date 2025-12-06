import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentEntity } from './comment.entity';
import { CarEntity } from '../car/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, CarEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
