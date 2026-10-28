import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}

