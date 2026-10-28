import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/payment.dto';
import { PaymentInitiationResult } from './providers/payment-provider.interface';
import { AuthGuard } from '../auth/auth.guard';
import { PaymentsTable, UsersTable } from '../database/database.types';

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  public async initiate(
    @Req() req: { user: UsersTable },
    @Body() dto: InitiatePaymentDto,
  ): Promise<PaymentInitiationResult> {
    return this.paymentsService.initiatePayment(dto, req.user.id);
  }

  @Get('booking/:bookingId')
  public async getPayment(
    @Param('bookingId') bookingId: string,
    @Req() req: { user: UsersTable },
  ): Promise<PaymentsTable | null> {
    return this.paymentsService.getPaymentByBooking(bookingId, req.user.id);
  }
}

