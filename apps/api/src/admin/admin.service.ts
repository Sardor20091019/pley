import { Injectable } from '@nestjs/common';
import { AuditLogsTable } from '../database/database.types';
import { AdminRepository } from './admin.repository';
import { AdminBookingItem } from './dto/admin.dto';

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
  constructor(private readonly adminRepository: AdminRepository) {}

  public async getDashboardMetrics(): Promise<AdminMetrics> {
    const totalUsers = await this.adminRepository.countUsers();
    const totalVenues = await this.adminRepository.countVenues();
    const sessions = await this.adminRepository.findAllSessions();
    const bookings = await this.adminRepository.findAllBookings();

    const now = new Date().toISOString();
    const upcoming = sessions.filter(
      (s) => s.scheduled_at >= now && s.status === 'PUBLISHED',
    );

    const confirmed = bookings.filter(
      (b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED',
    );
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
          (b) =>
            b.session_id === s.id &&
            (b.status === 'CONFIRMED' || b.status === 'COMPLETED'),
        ).length;
        totalBooked += bCount;
      }
    }

    const fillRate =
      totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

    return {
      totalUsers,
      totalVenues,
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
    return this.adminRepository.findAuditLogs(limit);
  }

  public async listAllBookingsForAdmin(): Promise<AdminBookingItem[]> {
    return this.adminRepository.findAdminBookings(100);
  }
}
