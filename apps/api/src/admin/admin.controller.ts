import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminService, AdminMetrics } from './admin.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { AuditLogsTable, UsersTable, UserStatus } from '../database/database.types';

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
    @Query('limit') limit?: string,
  ): Promise<AuditLogsTable[]> {
    const parsed = limit ? parseInt(limit, 10) : 50;
    return this.adminService.listAuditLogs(parsed);
  }

  @Get('bookings')
  public async getAllBookings(): Promise<any[]> {
    return this.adminService.listAllBookingsForAdmin();
  }

  @Get('users')
  public async getAllUsers(): Promise<UsersTable[]> {
    return this.usersService.listAllUsers();
  }

  @Patch('users/:id/status')
  public async updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
  ): Promise<UsersTable> {
    return this.usersService.updateUserStatus(id, status);
  }
}

