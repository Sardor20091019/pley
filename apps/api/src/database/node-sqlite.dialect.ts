import {
  CompiledQuery,
  DatabaseConnection,
  Dialect,
  Driver,
  Kysely,
  QueryCompiler,
  QueryResult,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from 'kysely';
import { DatabaseSync } from 'node:sqlite';

export class NodeSqliteConnection implements DatabaseConnection {
  constructor(private readonly db: DatabaseSync) {}

  public async executeQuery<R>(
    compiledQuery: CompiledQuery,
  ): Promise<QueryResult<R>> {
    const rawSql = compiledQuery.sql.trim();
    const isSelect =
      rawSql.toUpperCase().startsWith('SELECT') ||
      rawSql.toUpperCase().startsWith('PRAGMA') ||
      rawSql.toUpperCase().includes(' RETURNING ');

    const stmt = this.db.prepare(compiledQuery.sql);

    if (isSelect) {
      const rows = stmt.all(...(compiledQuery.parameters as any[])) as R[];
      return { rows };
    }

    const result = stmt.run(...(compiledQuery.parameters as any[]));
    return {
      numAffectedRows: BigInt(result.changes),
      insertId:
        result.lastInsertRowid !== undefined
          ? BigInt(result.lastInsertRowid)
          : undefined,
      rows: [],
    };
  }

  public async *streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
    throw new Error('Streaming not supported for NodeSqliteDialect');
  }
}

export class NodeSqliteDriver implements Driver {
  private readonly connection: NodeSqliteConnection;

  constructor(private readonly db: DatabaseSync) {
    this.connection = new NodeSqliteConnection(db);
  }

  public async init(): Promise<void> {}

  public async acquireConnection(): Promise<DatabaseConnection> {
    return this.connection;
  }

  public async beginTransaction(): Promise<void> {
    this.db.exec('BEGIN');
  }

  public async commitTransaction(): Promise<void> {
    this.db.exec('COMMIT');
  }

  public async rollbackTransaction(): Promise<void> {
    this.db.exec('ROLLBACK');
  }

  public async releaseConnection(): Promise<void> {}

  public async destroy(): Promise<void> {
    this.db.close();
  }
}

export class NodeSqliteDialect implements Dialect {
  constructor(private readonly db: DatabaseSync) {}

  public createDriver(): Driver {
    return new NodeSqliteDriver(this.db);
  }

  public createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler();
  }

  public createAdapter(): SqliteAdapter {
    return new SqliteAdapter();
  }

  public createIntrospector(db: Kysely<any>): SqliteIntrospector {
    return new SqliteIntrospector(db);
  }
}
