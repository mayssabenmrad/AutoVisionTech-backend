import {
  IsIn,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('TN')
  clientPhone: string;

  @IsNotEmpty()
  @IsDateString()
  visitDate: string;

  @IsNotEmpty()
  @IsString()
  visitTime: string;

  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'])
  status: string;

  @IsNotEmpty()
  @IsUUID()
  carId: string;
}
