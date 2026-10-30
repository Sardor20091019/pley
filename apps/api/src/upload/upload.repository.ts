import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuditLogsTable } from '../database/database.types';

@Injectable()
export class UploadRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async updateUserAvatar(
    userId: string,
    avatarUrl: string,
    now: string,
  ): Promise<void> {
    const db = this.databaseService.getDb();
    await db
      .updateTable('users')
      .set({
        avatar_url: avatarUrl,
        updated_at: now,
      })
      .where('id', '=', userId)
      .execute();
  }

  public async recordAuditLog(log: AuditLogsTable): Promise<void> {
    const db = this.databaseService.getDb();
    await db.insertInto('audit_logs').values(log).execute();
  }
}
