import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { DatabaseSchema } from './database.types';
import { Pool } from 'pg';
import { migrations } from './migrations';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private dbInstance: Kysely<DatabaseSchema> | null = null;
  private poolInstance: Pool | null = null;

  public async onModuleInit(): Promise<void> {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    this.poolInstance = new Pool({
      connectionString: databaseUrl,
    });

    this.dbInstance = new Kysely<DatabaseSchema>({
      dialect: new PostgresDialect({
        pool: this.poolInstance,
      }),
    });

    await this.runMigrations();
  }

  public async onModuleDestroy(): Promise<void> {
    if (this.dbInstance) {
      await this.dbInstance.destroy();
      this.dbInstance = null;
    }
    if (this.poolInstance) {
      await this.poolInstance.end();
      this.poolInstance = null;
    }
  }

  public getDb(): Kysely<DatabaseSchema> {
    if (!this.dbInstance) {
      throw new Error('Database service is not initialized');
    }
    return this.dbInstance;
  }

  private async runMigrations(): Promise<void> {
    const db = this.getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        name TEXT PRIMARY KEY,
        executed_at TEXT NOT NULL
      )
    `.execute(db);

    const executedRows = await db
      .selectFrom('_migrations')
      .select('name')
      .execute();

    const executedSet = new Set(executedRows.map((r) => r.name));

    for (const migration of migrations) {
      if (!executedSet.has(migration.name)) {
        await migration.up(db);
        await db
          .insertInto('_migrations')
          .values({
            name: migration.name,
            executed_at: new Date().toISOString(),
          })
          .execute();
      }
    }
  }
}
