import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1900, { message: 'Year must be at least 1900' })
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  kilometerAge: number;

  @IsNotEmpty()
  @IsIn(['available', 'reserved', 'sold'])
  status: string;

  @IsNotEmpty()
  @IsString()
  condition: string;

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}
