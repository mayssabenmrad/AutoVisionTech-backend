import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { CarEntity } from '../car/car.entity';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
  ) {}

  //Create a comment
  async create(commentData: CreateCommentDto): Promise<CommentEntity | null> {
    const car = await this.carRepository.findOne({
      where: { id: commentData.carId },
    });

    if (!car) {
      throw new NotFoundException('Car Not Found');
    }

    const comment = this.commentRepository.create({ ...commentData });
    return this.commentRepository.save(comment);
  }

  //retrieve all comments for a specific car
  async findByCarId(carId: string): Promise<CommentEntity[]> {
    return await this.commentRepository.find({ where: { carId } });
  }
}
