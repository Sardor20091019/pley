import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PaymentsTable, PaymentStatus } from '../database/database.types';
import { ClickProvider } from './providers/click.provider';
import { PaymeProvider } from './providers/payme.provider';
import { SimulatedProvider } from './providers/simulated.provider';
import { PaymentInitiationResult } from './providers/payment-provider.interface';
import { InitiatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly clickProvider: ClickProvider,
    private readonly paymeProvider: PaymeProvider,
    private readonly simulatedProvider: SimulatedProvider,
  ) {}

  public async initiatePayment(
    dto: InitiatePaymentDto,
    userId: string,
  ): Promise<PaymentInitiationResult> {
    const db = this.databaseService.getDb();
    const booking = await db
      .selectFrom('bookings')
      .selectAll()
      .where('id', '=', dto.bookingId)
      .executeTakeFirst();

    if (!booking) {
      throw new NotFoundException(`Booking ${dto.bookingId} not found`);
    }

    if (booking.user_id !== userId) {
      throw new ForbiddenException('Cannot pay for another user reservation');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Cannot pay for a cancelled booking');
    }

    const totalAmount = booking.price_snapshot + booking.service_fee_snapshot;
    const idempotencyKey = `idemp_${dto.bookingId}_${dto.provider}_${totalAmount}`;

    let existingPayment = await db
      .selectFrom('payments')
      .selectAll()
      .where('idempotency_key', '=', idempotencyKey)
      .executeTakeFirst();

    if (existingPayment && existingPayment.status === 'PAID') {
      return {
        paymentId: existingPayment.id,
        redirectUrl: null,
        providerTransactionId: existingPayment.provider_transaction_id,
        status: 'SUCCESS',
        isSimulated: existingPayment.provider === 'SIMULATED',
      };
    }

    let providerInstance = this.simulatedProvider;
    if (dto.provider === 'CLICK') {
      providerInstance = this.clickProvider as any;
    } else if (dto.provider === 'PAYME') {
      providerInstance = this.paymeProvider as any;
    }

    const result = await providerInstance.initiatePayment({
      bookingId: dto.bookingId,
      amount: totalAmount,
      currency: 'UZS',
      returnUrl: dto.returnUrl,
    });

    const now = new Date().toISOString();
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const initialStatus: PaymentStatus = result.status === 'SUCCESS' ? 'PAID' : 'UNPAID';

    if (!existingPayment) {
      await db
        .insertInto('payments')
        .values({
          id: paymentId,
          booking_id: dto.bookingId,
          provider: dto.provider,
          provider_transaction_id: result.providerTransactionId,
          amount: totalAmount,
          currency: 'UZS',
          status: initialStatus,
          idempotency_key: idempotencyKey,
          verified_at: result.status === 'SUCCESS' ? now : null,
          created_at: now,
          updated_at: now,
        })
        .execute();
    }

    if (result.status === 'SUCCESS') {
      await db
        .updateTable('bookings')
        .set({
          status: 'CONFIRMED',
          payment_status: 'PAID',
          updated_at: now,
        })
        .where('id', '=', dto.bookingId)
        .execute();
    }

    return result;
  }

  public async getPaymentByBooking(
    bookingId: string,
    userId: string,
  ): Promise<PaymentsTable | null> {
    const db = this.databaseService.getDb();
    const booking = await db
      .selectFrom('bookings')
      .selectAll()
      .where('id', '=', bookingId)
      .executeTakeFirst();

    if (!booking) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }

    if (booking.user_id !== userId) {
      throw new ForbiddenException('Cannot inspect another user payment');
    }

    const payment = await db
      .selectFrom('payments')
      .selectAll()
      .where('booking_id', '=', bookingId)
      .orderBy('created_at', 'desc')
      .executeTakeFirst();

    return payment || null;
  }
}

