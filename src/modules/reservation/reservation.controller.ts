import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationFilterDto } from './dto/reservation-filter.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { Public } from 'src/auth/decorators/public.decorator';
@Controller('reservations')
@UseGuards(PermissionsGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // POST /reservations/:carId : create a new reservation
  @Post(':carId')
  @Public()
  async create(
    @Param('carId') carId: string,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return await this.reservationService.createReservation(
      createReservationDto,
      carId,
    );
  }

  // GET /reservations : find all with filters and pagination
  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.MANAGE_RESERVATIONS)
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() rawQuery: Record<string, any>,
  ) {
    const filters: ReservationFilterDto = rawQuery;
    return this.reservationService.findAll(page, limit, filters);
  }

  // GET /reservations/:id : retrieve a reservation by ID
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.MANAGE_RESERVATIONS)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationService.findOne(id);
  }

  // PATCH /reservations/:id : update an existing reservation
  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.MANAGE_RESERVATIONS)
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationService.updateReservation(
      id,
      updateReservationDto,
    );
  }

  // DELETE /reservations/:id : delete a reservation
  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(Permission.MANAGE_RESERVATIONS)
  remove(@Param('id') id: string) {
    return this.reservationService.deleteReservation(id);
  }
}
