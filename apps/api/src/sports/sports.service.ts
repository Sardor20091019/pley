import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SportsTable } from '../database/database.types';

@Injectable()
export class SportsService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async listActiveSports(): Promise<SportsTable[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('sports')
      .selectAll()
      .where('active', '=', 1)
      .orderBy('name', 'asc')
      .execute();
  }

  public async getSportById(id: string): Promise<SportsTable> {
    const db = this.databaseService.getDb();
    const sport = await db
      .selectFrom('sports')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!sport) {
      throw new NotFoundException(`Sport with id ${id} not found`);
    }

    return sport;
  }

  public async getSportBySlug(slug: string): Promise<SportsTable> {
    const db = this.databaseService.getDb();
    const sport = await db
      .selectFrom('sports')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirst();

    if (!sport) {
      throw new NotFoundException(`Sport with slug ${slug} not found`);
    }

    return sport;
  }
}

