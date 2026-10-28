import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { AttendanceStatus } from '../../database/database.types';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  sessionId!: string;
}

export class UpdateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  attendanceStatus!: AttendanceStatus;
}

