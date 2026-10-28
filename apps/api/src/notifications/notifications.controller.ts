import {
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { NotificationsTable, UsersTable } from '../database/database.types';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  public async getNotifications(
    @Req() req: { user: UsersTable },
  ): Promise<NotificationsTable[]> {
    return this.notificationsService.getUserNotifications(req.user.id);
  }

  @Patch(':id/read')
  public async markAsRead(
    @Param('id') id: string,
    @Req() req: { user: UsersTable },
  ): Promise<{ success: boolean }> {
    await this.notificationsService.markAsRead(id, req.user.id);
    return { success: true };
  }
}

