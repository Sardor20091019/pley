import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateVenueDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  district!: string;

  @IsNotEmpty()
  @IsString()
  address!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  supportedSports!: string;

  @IsInt()
  @Min(0)
  hourlyRate!: number;

  @IsOptional()
  @IsBoolean()
  isPartner?: boolean;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  amenities?: string;
}

export class UpdateVenueDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  supportedSports?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  hourlyRate?: number;

  @IsOptional()
  @IsBoolean()
  isPartner?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  amenities?: string;
}

