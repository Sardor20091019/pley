import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersTable } from '../database/database.types';

export interface UserConfirmedBookingWithVenue {
  booking_id: string;
  booking_status: string;
  booked_at: string;
  sport_id: string;
  district: string;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findById(id: string): Promise<UsersTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async findByEmail(email: string): Promise<UsersTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  public async findAll(): Promise<UsersTable[]> {
    const db = this.databaseService.getDb();
    return db.selectFrom('users').selectAll().orderBy('created_at', 'desc').execute();
  }

  public async update(id: string, values: Partial<UsersTable>): Promise<void> {
    const db = this.databaseService.getDb();
    await db.updateTable('users').set(values).where('id', '=', id).execute();
  }

  public async findUserConfirmedBookingsWithVenues(
    userId: string,
  ): Promise<UserConfirmedBookingWithVenue[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('bookings')
      .innerJoin('sessions', 'bookings.session_id', 'sessions.id')
      .innerJoin('venues', 'sessions.venue_id', 'venues.id')
      .select([
        'bookings.id as booking_id',
        'bookings.status as booking_status',
        'bookings.booked_at as booked_at',
        'sessions.sport_id as sport_id',
        'venues.district as district',
      ])
      .where('bookings.user_id', '=', userId)
      .where('bookings.status', 'in', ['CONFIRMED', 'COMPLETED'])
      .execute();
  }
}
