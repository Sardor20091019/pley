import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  AuditLogsTable,
  BookingsTable,
  SessionsTable,
} from '../database/database.types';
import { AdminBookingItem } from './dto/admin.dto';

@Injectable()
export class AdminRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async countUsers(): Promise<number> {
    const db = this.databaseService.getDb();
    const rows = await db.selectFrom('users').select('id').execute();
    return rows.length;
  }

  public async countVenues(): Promise<number> {
    const db = this.databaseService.getDb();
    const rows = await db.selectFrom('venues').select('id').execute();
    return rows.length;
  }

  public async findAllSessions(): Promise<SessionsTable[]> {
    const db = this.databaseService.getDb();
    return db.selectFrom('sessions').selectAll().execute();
  }

  public async findAllBookings(): Promise<BookingsTable[]> {
    const db = this.databaseService.getDb();
    return db.selectFrom('bookings').selectAll().execute();
  }

  public async findAuditLogs(limit: number = 50): Promise<AuditLogsTable[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('audit_logs')
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(limit)
      .execute();
  }

  public async findAdminBookings(
    limit: number = 100,
  ): Promise<AdminBookingItem[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('bookings')
      .innerJoin('sessions', 'bookings.session_id', 'sessions.id')
      .innerJoin('users', 'bookings.user_id', 'users.id')
      .innerJoin('venues', 'sessions.venue_id', 'venues.id')
      .select([
        'bookings.id as booking_id',
        'bookings.status as status',
        'bookings.payment_status as payment_status',
        'bookings.attendance_status as attendance_status',
        'bookings.booked_at as booked_at',
        'bookings.price_snapshot as price',
        'bookings.service_fee_snapshot as service_fee',
        'sessions.title as session_title',
        'sessions.scheduled_at as scheduled_at',
        'venues.name as venue_name',
        'users.first_name as user_name',
        'users.email as user_email',
      ])
      .orderBy('bookings.booked_at', 'desc')
      .limit(limit)
      .execute();
  }
}

