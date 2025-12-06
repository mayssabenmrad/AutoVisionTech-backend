import {
  IsIn,
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @IsOptional()
  @IsString()
  clientPhone?: string;

  @IsOptional()
  @IsDateString()
  visitDate?: string;

  @IsOptional()
  @IsString()
  visitTime?: string;

  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled'])
  status?: string;
}
