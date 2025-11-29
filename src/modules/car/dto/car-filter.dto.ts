import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CarFilterDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumberString()
  minYear?: string;

  @IsOptional()
  @IsNumberString()
  maxYear?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByYear?: 'asc' | 'desc';

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByPrice?: 'asc' | 'desc';

  @IsOptional()
  @IsNumberString()
  minkilometerAge?: string;

  @IsOptional()
  @IsNumberString()
  maxkilometerAge?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByKilometerAge?: 'asc' | 'desc';

  @IsOptional()
  @IsIn(['available', 'reserved', 'sold'])
  status?: string;
}
