import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentProvider } from '../../database/database.types';

export class InitiatePaymentDto {
  @IsNotEmpty()
  @IsString()
  bookingId!: string;

  @IsNotEmpty()
  @IsString()
  provider!: PaymentProvider;

  @IsNotEmpty()
  @IsString()
  returnUrl!: string;
}

export class ConfirmSimulatedPaymentDto {
  @IsNotEmpty()
  @IsString()
  bookingId!: string;
}

