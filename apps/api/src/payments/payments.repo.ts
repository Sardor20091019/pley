import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  BookingsTable,
  PaymentsTable,
  PaymentStatus,
} from '../database/database.types';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findBookingById(bookingId: string): Promise<BookingsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('bookings')
      .selectAll()
      .where('id', '=', bookingId)
      .executeTakeFirst();
  }

  public async findPaymentByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<PaymentsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('payments')
      .selectAll()
      .where('idempotency_key', '=', idempotencyKey)
      .executeTakeFirst();
  }

  public async createPayment(payment: PaymentsTable): Promise<void> {
    const db = this.databaseService.getDb();
    await db.insertInto('payments').values(payment).execute();
  }

  public async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    verifiedAt: string | null,
    now: string,
  ): Promise<void> {
    const db = this.databaseService.getDb();
    await db
      .updateTable('payments')
      .set({
        status,
        verified_at: verifiedAt,
        updated_at: now,
      })
      .where('id', '=', id)
      .execute();
  }

  public async markBookingAsPaid(bookingId: string, now: string): Promise<void> {
    const db = this.databaseService.getDb();
    await db
      .updateTable('bookings')
      .set({
        status: 'CONFIRMED',
        payment_status: 'PAID',
        updated_at: now,
      })
      .where('id', '=', bookingId)
      .execute();
  }

  public async findLatestPaymentByBookingId(
    bookingId: string,
  ): Promise<PaymentsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('payments')
      .selectAll()
      .where('booking_id', '=', bookingId)
      .orderBy('created_at', 'desc')
      .executeTakeFirst();
  }
}

