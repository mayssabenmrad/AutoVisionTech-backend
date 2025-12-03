import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { UploadService } from '../upload/upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CarEntity } from './car.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CarFilterDto } from './dto/car-filter.dto';
import { User } from '../user/user.entity';

@Injectable()
export class CarService {
  constructor(
    private readonly uploadService: UploadService, //service to upload files
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>, //repository typeorm for car
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  applyFilters(qb: SelectQueryBuilder<CarEntity>, filters: CarFilterDto): void {
    if (filters.brand) {
      qb.andWhere('LOWER(car.brand) LIKE LOWER(:brand)', {
        brand: `%${filters.brand}%`,
      });
    }

    if (filters.model) {
      qb.andWhere('LOWER(car.model) LIKE LOWER(:model)', {
        model: `%${filters.model}%`,
      });
    }

    if (filters.minYear) {
      qb.andWhere('car.year >= :minYear', {
        minYear: Number(filters.minYear),
      });
    }

    if (filters.maxYear) {
      qb.andWhere('car.year <= :maxYear', {
        maxYear: Number(filters.maxYear),
      });
    }

    if (filters.minPrice) {
      qb.andWhere('car.price >= :minPrice', {
        minPrice: Number(filters.minPrice),
      });
    }

    if (filters.maxPrice) {
      qb.andWhere('car.price <= :maxPrice', {
        maxPrice: Number(filters.maxPrice),
      });
    }

    if (filters.minkilometerAge) {
      qb.andWhere('car.kilometerAge >= :minkilometerAge', {
        minkilometerAge: Number(filters.minkilometerAge),
      });
    }

    if (filters.maxkilometerAge) {
      qb.andWhere('car.kilometerAge <= :maxkilometerAge', {
        maxkilometerAge: Number(filters.maxkilometerAge),
      });
    }

    if (filters.status) {
      qb.andWhere('car.status = :status', {
        status: filters.status,
      });
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters: CarFilterDto,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const qb = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.user', 'user')
      .leftJoin('car.comments', 'comments')
      .addSelect('COUNT(comments.id)', 'totalComments')
      .groupBy('car.id')
      .addGroupBy('user.id');

    //Apply filters
    this.applyFilters(qb, filters);

    //Sorting
    if (filters.sortByPrice) {
      qb.orderBy(
        'car.price',
        filters.sortByPrice.toUpperCase() as 'ASC' | 'DESC',
      );
    } else if (filters.sortByYear) {
      qb.orderBy(
        'car.year',
        filters.sortByYear.toUpperCase() as 'ASC' | 'DESC',
      );
    } else if (filters.sortByKilometerAge) {
      qb.orderBy(
        'car.kilometerAge',
        filters.sortByKilometerAge.toUpperCase() as 'ASC' | 'DESC',
      );
    } else {
      qb.orderBy('car.createdAt', 'DESC');
    }

    //Clone query for count
    const countQb = qb.clone();
    const countRaw = await countQb.getRawMany();
    const totalItems = countRaw.length;

    //Apply pagination
    qb.skip(skip).take(limit);

    //Execute
    const { raw, entities } = await qb.getRawAndEntities();

    const typedRaw = raw as Array<{
      avgRating: number | null;
      totalComments: number | null;
    }>;

    //Mapping
    const mapped = entities.map((car, i) => {
      return {
        ...car,
        avgRating: Number(typedRaw[i]?.avgRating ?? 0),
        totalComments: Number(typedRaw[i]?.totalComments ?? 0),
      };
    });

    //Return paginated result
    return {
      items: mapped,
      meta: {
        totalItems,
        itemCount: mapped.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: string): Promise<CarEntity | null> {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: ['comments', 'reservations', 'user'],
    });
    if (!car) {
      throw new NotFoundException('Car Not Found');
    }
    return car;
  }

  async createCar(
    carData: CreateCarDto,
    userId: string,
    files?: Express.Multer.File[],
  ): Promise<CarEntity> {
    //check if the user exists
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Start by creating the car without images
    const car = this.carRepository.create({
      ...carData,
      userId,
    });

    const imageUrls =
      files?.map((file) =>
        this.uploadService.getFileUrl(file.filename, 'cars'),
      ) || [];

    // add images to entity
    car.images = imageUrls;

    return this.carRepository.save(car);
  }

  async updateCar(
    id: string,
    dto: UpdateCarDto,
    userId: string,
    files?: Express.Multer.File[],
  ): Promise<CarEntity | null> {
    const car = await this.carRepository.findOne({ where: { id } });

    if (!car) {
      throw new BadRequestException('Car not found');
    }

    if (car.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    const newUrls =
      files?.map((file) =>
        this.uploadService.getFileUrl(file.filename, 'cars'),
      ) ?? [];

    const keep = dto.imagesToKeep ?? [];
    const finalImages = [...keep, ...newUrls];

    if (finalImages.length > 5) {
      await this.uploadService.deleteMultipleFiles(newUrls);
      throw new BadRequestException('Max 5 images allowed');
    }

    const oldImages = car.images ?? [];
    const imagesToDelete = oldImages.filter((img) => !keep.includes(img));

    const updateData: any = {
      updatedAt: new Date(),
      images: finalImages,
    };

    Object.assign(updateData, dto);

    await this.carRepository
      .createQueryBuilder()
      .update(CarEntity)
      .set(updateData)
      .where('id = :id', { id })
      .execute();

    if (imagesToDelete.length) {
      await this.uploadService.deleteMultipleFiles(imagesToDelete);
    }

    // Reload the car
    return await this.carRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'reservations'],
    });
  }

  async deleteCar(id: string, userId: string) {
    const car = await this.carRepository.findOne({ where: { id } });

    if (!car) {
      throw new BadRequestException('Car not found');
    }

    if (car.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this car',
      );
    }

    // Delete images before deleting car
    if (car.images && car.images.length > 0) {
      await this.uploadService.deleteMultipleFiles(car.images);
    }

    await this.carRepository.delete(id);

    return { message: 'Car deleted successfully' };
  }

  async updateCarImages(
    id: string,
    userId: string,
    newImageUrls: string[],
    keepExisting: boolean = false,
  ): Promise<CarEntity> {
    const car = await this.carRepository.findOne({ where: { id } });

    if (!car) {
      throw new BadRequestException('Car not found');
    }

    if (car.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this car',
      );
    }

    const oldImages = car.images || [];
    let finalImages: string[] = [];
    let imagesToDelete: string[] = [];

    if (keepExisting) {
      finalImages = [...oldImages, ...newImageUrls];

      if (finalImages.length > 5) {
        await this.uploadService.deleteMultipleFiles(newImageUrls);
        throw new BadRequestException(
          `Cannot add ${newImageUrls.length} images. Car already has ${oldImages.length} images. Maximum 5 images allowed.`,
        );
      }
    } else {
      finalImages = newImageUrls;
      imagesToDelete = oldImages;
    }

    try {
      car.images = finalImages;
      car.updatedAt = new Date();
      const updatedCar = await this.carRepository.save(car);

      if (imagesToDelete.length > 0) {
        await this.uploadService.deleteMultipleFiles(imagesToDelete);
      }

      return updatedCar;
    } catch (error) {
      if (newImageUrls.length > 0) {
        await this.uploadService.deleteMultipleFiles(newImageUrls);
      }
      throw error;
    }
  }
}
