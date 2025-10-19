import { readMigrationFiles } from "../migrator.js";
import { sql } from "../sql/sql.js";
async function migrate(db, config) {
  const migrations = readMigrationFiles(config);
  const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
  const migrationsSchema = config.migrationsSchema ?? "drizzle";
  const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at bigint
		)
	`;
  await db.session.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(migrationsSchema)}`);
  await db.session.execute(migrationTableCreate);
  const dbMigrations = await db.session.all(
    sql`select id, hash, created_at from ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} order by created_at desc limit 1`
  );
  const lastDbMigration = dbMigrations[0];
  const rowsToInsert = [];
  for await (const migration of migrations) {
    if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
      for (const stmt of migration.sql) {
        await db.session.execute(sql.raw(stmt));
      }
      rowsToInsert.push(
        sql`insert into ${sql.identifier(migrationsSchema)}.${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`
      );
    }
  }
  for await (const rowToInsert of rowsToInsert) {
    await db.session.execute(rowToInsert);
  }
}
export {
  migrate
};
//# sourceMappingURL=migrator.js.map