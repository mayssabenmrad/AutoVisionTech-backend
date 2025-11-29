import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class ReservationFilterDto {
  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  clientEmail?: string;

  @IsOptional()
  @IsString()
  clientPhone?: string;

  @IsOptional()
  @IsDateString()
  minVisitDate?: string;

  @IsOptional()
  @IsDateString()
  maxVisitDate?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByVisitDate?: 'asc' | 'desc';

  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'])
  status?: string;

  @IsOptional()
  @IsUUID()
  carId?: string;
}
