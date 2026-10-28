import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationsTable } from '../database/database.types';

@Injectable()
export class NotificationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async getUserNotifications(userId: string): Promise<NotificationsTable[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('notifications')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .limit(20)
      .execute();
  }

  public async markAsRead(notificationId: string, userId: string): Promise<void> {
    const db = this.databaseService.getDb();
    await db
      .updateTable('notifications')
      .set({ is_read: 1 })
      .where('id', '=', notificationId)
      .where('user_id', '=', userId)
      .execute();
  }
}

