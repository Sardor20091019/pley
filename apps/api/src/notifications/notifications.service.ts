import { Injectable } from '@nestjs/common';
import { NotificationsTable } from '../database/database.types';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  public async getUserNotifications(
    userId: string,
  ): Promise<NotificationsTable[]> {
    return this.notificationsRepository.findByUserId(userId);
  }

  public async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    await this.notificationsRepository.markAsRead(notificationId, userId);
  }
}
