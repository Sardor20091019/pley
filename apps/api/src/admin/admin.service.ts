import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuditLogsTable, UserStatus } from '../database/database.types';

export interface AdminMetrics {
  totalUsers: number;
  totalVenues: number;
  totalSessions: number;
  upcomingSessions: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  grossBookingVolumeUz: number;
  platformRevenueUz: number;
  averageFillRatePercentage: number;
}

@Injectable()
export class AdminService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async getDashboardMetrics(): Promise<AdminMetrics> {
    const db = this.databaseService.getDb();

    const users = await db.selectFrom('users').select('id').execute();
    const venues = await db.selectFrom('venues').select('id').execute();
    const sessions = await db
      .selectFrom('sessions')
      .selectAll()
      .execute();

    const bookings = await db
      .selectFrom('bookings')
      .selectAll()
      .execute();

    const now = new Date().toISOString();
    const upcoming = sessions.filter(
      (s) => s.scheduled_at >= now && s.status === 'PUBLISHED',
    );

    const confirmed = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
    const cancelled = bookings.filter((b) => b.status === 'CANCELLED');

    let grossVolume = 0;
    let revenue = 0;

    for (const b of confirmed) {
      grossVolume += b.price_snapshot + b.service_fee_snapshot;
      revenue += b.service_fee_snapshot;
    }

    let totalCapacity = 0;
    let totalBooked = 0;

    for (const s of sessions) {
      if (s.status !== 'CANCELLED') {
        totalCapacity += s.max_slots;
        const bCount = bookings.filter(
          (b) => b.session_id === s.id && (b.status === 'CONFIRMED' || b.status === 'COMPLETED'),
        ).length;
        totalBooked += bCount;
      }
    }

    const fillRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

    return {
      totalUsers: users.length,
      totalVenues: venues.length,
      totalSessions: sessions.length,
      upcomingSessions: upcoming.length,
      totalBookings: bookings.length,
      confirmedBookings: confirmed.length,
      cancelledBookings: cancelled.length,
      grossBookingVolumeUz: grossVolume,
      platformRevenueUz: revenue,
      averageFillRatePercentage: fillRate,
    };
  }

  public async listAuditLogs(limit: number = 50): Promise<AuditLogsTable[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('audit_logs')
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(limit)
      .execute();
  }

  public async listAllBookingsForAdmin(): Promise<any[]> {
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
        'users.telegram_username as user_telegram',
      ])
      .orderBy('bookings.booked_at', 'desc')
      .limit(100)
      .execute();
  }
}

