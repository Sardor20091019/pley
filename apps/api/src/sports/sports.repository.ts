import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SportsTable } from '../database/database.types';

@Injectable()
export class SportsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findAllActive(): Promise<SportsTable[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('sports')
      .selectAll()
      .where('active', '=', 1)
      .orderBy('name', 'asc')
      .execute();
  }

  public async findById(id: string): Promise<SportsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('sports')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async findBySlug(slug: string): Promise<SportsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('sports')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirst();
  }

  public async create(data: SportsTable): Promise<void> {
    const db = this.databaseService.getDb();
    await db.insertInto('sports').values(data).execute();
  }
}
