import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService, AdminMetrics } from './admin.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { AuditLogsTable, UsersTable } from '../database/database.types';
import { UpdateUserStatusDto } from '../users/dto/user.dto';
import { AdminBookingItem, AuditLogsQueryDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) {}

  @Get('metrics')
  public async getMetrics(): Promise<AdminMetrics> {
    return this.adminService.getDashboardMetrics();
  }

  @Get('audit-logs')
  public async getAuditLogs(
    @Query() query: AuditLogsQueryDto,
  ): Promise<AuditLogsTable[]> {
    const limit = query.limit || 50;
    return this.adminService.listAuditLogs(limit);
  }

  @Get('bookings')
  public async getAllBookings(): Promise<AdminBookingItem[]> {
    return this.adminService.listAllBookingsForAdmin();
  }

  @Get('users')
  public async getAllUsers(): Promise<UsersTable[]> {
    return this.usersService.listAllUsers();
  }

  @Patch('users/:id/status')
  public async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<UsersTable> {
    return this.usersService.updateUserStatus(id, dto.status);
  }
}
