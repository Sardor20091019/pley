import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DistrictsTable } from '../database/database.types';

@Injectable()
export class DistrictsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findAllActive(): Promise<DistrictsTable[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('districts')
      .selectAll()
      .where('active', '=', 1)
      .orderBy('order_index', 'asc')
      .orderBy('name', 'asc')
      .execute();
  }

  public async findBySlug(slug: string): Promise<DistrictsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('districts')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirst();
  }

  public async findDistinctVenueDistricts(): Promise<string[]> {
    const db = this.databaseService.getDb();
    const rows = await db
      .selectFrom('venues')
      .select('district')
      .distinct()
      .where('active', '=', 1)
      .execute();
    return rows.map((r) => r.district);
  }

  public async create(data: DistrictsTable): Promise<void> {
    const db = this.databaseService.getDb();
    await db.insertInto('districts').values(data).execute();
  }
}

