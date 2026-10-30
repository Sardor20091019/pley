import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuditLogsTable, VenuesTable } from '../database/database.types';

@Injectable()
export class VenuesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findAllActive(district?: string): Promise<VenuesTable[]> {
    const db = this.databaseService.getDb();
    let query = db.selectFrom('venues').selectAll().where('active', '=', 1);

    if (district) {
      query = query.where('district', '=', district);
    }

    return query.orderBy('name', 'asc').execute();
  }

  public async findById(id: string): Promise<VenuesTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('venues')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async create(data: VenuesTable): Promise<void> {
    const db = this.databaseService.getDb();
    await db.insertInto('venues').values(data).execute();
  }

  public async update(id: string, values: Partial<VenuesTable>): Promise<void> {
    const db = this.databaseService.getDb();
    await db.updateTable('venues').set(values).where('id', '=', id).execute();
  }

  public async recordAuditLog(log: AuditLogsTable): Promise<void> {
    const db = this.databaseService.getDb();
    await db.insertInto('audit_logs').values(log).execute();
  }
}
