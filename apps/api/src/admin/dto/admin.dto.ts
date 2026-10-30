import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AuditLogsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public limit?: number;
}

export interface AdminBookingItem {
  booking_id: string;
  status: string;
  payment_status: string;
  attendance_status: string;
  booked_at: string;
  price: number;
  service_fee: number;
  session_title: string;
  scheduled_at: string;
  venue_name: string;
  user_name: string;
  user_email: string;
}

