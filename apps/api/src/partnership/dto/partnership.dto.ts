import { IsNotEmpty, IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePartnershipInquiryDto {
  @IsNotEmpty()
  @IsString()
  contactName!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  venueName!: string;

  @IsNotEmpty()
  @IsString()
  district!: string;

  @IsNotEmpty()
  @IsString()
  sportTypes!: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsIn(['VENUE', 'SESSION'])
  inquiryType?: 'VENUE' | 'SESSION';

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pricePerSlot?: number;

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}

