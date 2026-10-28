import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingsService, UserBookingItem } from './bookings.service';
import { CreateBookingDto, UpdateAttendanceDto } from './dto/booking.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { BookingsTable, UsersTable } from '../database/database.types';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  public async createBooking(
    @Req() req: { user: UsersTable },
    @Body() dto: CreateBookingDto,
  ): Promise<BookingsTable> {
    return this.bookingsService.reserveSpot(req.user.id, dto.sessionId);
  }

  @Get('my')
  public async getMyBookings(
    @Req() req: { user: UsersTable },
  ): Promise<UserBookingItem[]> {
    return this.bookingsService.getUserBookings(req.user.id);
  }

  @Delete(':id')
  public async cancelBooking(
    @Param('id') id: string,
    @Req() req: { user: UsersTable },
  ): Promise<BookingsTable> {
    return this.bookingsService.cancelBooking(id, req.user.id, req.user.role);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/attendance')
  public async updateAttendance(
    @Param('id') id: string,
    @Req() req: { user: UsersTable },
    @Body() dto: UpdateAttendanceDto,
  ): Promise<BookingsTable> {
    return this.bookingsService.updateAttendance(
      id,
      dto.attendanceStatus,
      req.user.id,
    );
  }
}

