import { IsNotEmpty, IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePartnershipInquiryDto {
  @IsNotEmpty()
  @IsString()
  public contactName!: string;

  @IsNotEmpty()
  @IsString()
  public phone!: string;

  @IsNotEmpty()
  @IsString()
  public venueName!: string;

  @IsNotEmpty()
  @IsString()
  public district!: string;

  @IsNotEmpty()
  @IsString()
  public sportTypes!: string;

  @IsOptional()
  @IsString()
  public message?: string;

  @IsOptional()
  @IsIn(['VENUE', 'SESSION'])
  public inquiryType?: 'VENUE' | 'SESSION';

  @IsOptional()
  @IsString()
  public imageUrl?: string;

  @IsOptional()
  @IsString()
  public scheduledAt?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public pricePerSlot?: number;

  @IsOptional()
  @IsString()
  public turnstileToken?: string;
}

export class UpdatePartnershipStatusDto {
  @IsNotEmpty()
  @IsIn(['PENDING', 'ACCEPTED', 'REJECTED'])
  public status!: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
