import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from '../../database/database.types';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  sessionId!: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class UpdateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  attendanceStatus!: AttendanceStatus;
}
