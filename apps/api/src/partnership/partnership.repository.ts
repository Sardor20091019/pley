import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PartnershipInquiriesTable } from '../database/database.types';

@Injectable()
export class PartnershipRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async create(
    inquiry: PartnershipInquiriesTable,
  ): Promise<PartnershipInquiriesTable> {
    const db = this.databaseService.getDb();
    await db.insertInto('partnership_inquiries').values(inquiry).execute();
    return db
      .selectFrom('partnership_inquiries')
      .selectAll()
      .where('id', '=', inquiry.id)
      .executeTakeFirstOrThrow();
  }

  public async findAll(): Promise<PartnershipInquiriesTable[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('partnership_inquiries')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
  }

  public async findById(
    id: string,
  ): Promise<PartnershipInquiriesTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('partnership_inquiries')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async updateStatus(
    id: string,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<PartnershipInquiriesTable> {
    const db = this.databaseService.getDb();
    await db
      .updateTable('partnership_inquiries')
      .set({ status })
      .where('id', '=', id)
      .execute();

    return db
      .selectFrom('partnership_inquiries')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  public async delete(id: string): Promise<void> {
    const db = this.databaseService.getDb();
    await db
      .deleteFrom('partnership_inquiries')
      .where('id', '=', id)
      .execute();
  }
}
