import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CarService } from './car.service';
import { UploadService } from '../upload/upload.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarFilterDto } from './dto/car-filter.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { Public } from 'src/auth/decorators/public.decorator';
import { multerConfig } from 'src/config/multer.config';
import { CleanupFilesInterceptor } from '../upload/interceptors/cleanup-files.interceptor';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@Controller('cars')
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly uploadService: UploadService,
  ) {}

  // GET /cars : find all with filters and pagination
  @Get()
  @Public()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query() rawQuery: Record<string, any>,
  ) {
    const filters: CarFilterDto = rawQuery;
    return this.carService.findAll(page, limit, filters);
  }

  // GET /cars/:id : retrieve a car by ID
  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.carService.findOne(id);
  }

  // POST /cars : create a new car
  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.CREATE_CAR)
  @UseInterceptors(
    FilesInterceptor('images', 5, multerConfig),
    CleanupFilesInterceptor,
  )
  async create(
    @CurrentUser() user: AuthUser,
    @Body() carData: CreateCarDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      this.uploadService.validateFiles(files);
    }

    return await this.carService.createCar(carData, user.id, files);
  }

  // PATCH /cars/:id : update an existing car
  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.UPDATE_CAR)
  @UseInterceptors(
    FilesInterceptor('images', 5, multerConfig),
    CleanupFilesInterceptor,
  )
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: AuthUser,
  ) {
    if (files && files.length > 0) {
      this.uploadService.validateFiles(files);
    }
    return await this.carService.updateCar(id, updateCarDto, user.id, files);
  }

  // PATCH /cars/:id/images : update car images
  @Patch(':id/images')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.UPDATE_CAR)
  @UseInterceptors(
    FilesInterceptor('images', 5, multerConfig),
    CleanupFilesInterceptor,
  )
  async updateImages(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('replaceAll') replaceAll?: string, // 'true' or 'false'
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    this.uploadService.validateFiles(files);

    const newImageUrls = files.map((file) =>
      this.uploadService.getFileUrl(file.filename, 'cars'),
    );

    const shouldReplaceAll = replaceAll === 'true';

    return await this.carService.updateCarImages(
      id,
      user.id,
      newImageUrls,
      !shouldReplaceAll, // keepExisting in the car service
    );
  }

  // DELETE /cars/:id : delete a car
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.DELETE_CAR)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.carService.deleteCar(id, user.id);
  }
}
