import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { DatabaseSchema } from './database.types';
import { Pool } from 'pg';
import { DatabaseSync } from 'node:sqlite';
import { NodeSqliteDialect } from './node-sqlite.dialect';
import { migrations } from './migrations';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private dbInstance: Kysely<DatabaseSchema> | null = null;
  private poolInstance: Pool | null = null;
  private sqliteInstance: DatabaseSync | null = null;

  public async onModuleInit(): Promise<void> {
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl && !databaseUrl.startsWith('sqlite:')) {
      this.poolInstance = new Pool({
        connectionString: databaseUrl,
      });
      this.dbInstance = new Kysely<DatabaseSchema>({
        dialect: new PostgresDialect({
          pool: this.poolInstance,
        }),
      });
    } else {
      const dbPath = process.env.SQLITE_PATH || ':memory:';
      this.sqliteInstance = new DatabaseSync(dbPath);
      this.dbInstance = new Kysely<DatabaseSchema>({
        dialect: new NodeSqliteDialect(this.sqliteInstance),
      });
    }

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
    this.sqliteInstance = null;
  }

  public getDb(): Kysely<DatabaseSchema> {
    if (!this.dbInstance) {
      throw new Error('Database service is not initialized');
    }
    return this.dbInstance;
  }

  private async runMigrations(): Promise<void> {
    const db = this.getDb();
    const isPostgres = this.poolInstance !== null;

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
        await migration.up(db, isPostgres);
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
