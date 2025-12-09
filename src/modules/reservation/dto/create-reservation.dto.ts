import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDateString,
  IsNumberString,
  Length,
} from 'class-validator';

/**
 * Data Transfer Object for creating a reservation.
 */
export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(8)
  clientPhone: string;

  @IsNotEmpty()
  @IsDateString()
  visitDate: string;

  @IsNotEmpty()
  @IsString()
  visitTime: string;
}
