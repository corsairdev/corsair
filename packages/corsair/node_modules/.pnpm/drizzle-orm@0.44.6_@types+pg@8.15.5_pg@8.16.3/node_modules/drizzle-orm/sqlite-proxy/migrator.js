import { readMigrationFiles } from "../migrator.js";
import { sql } from "../sql/sql.js";
async function migrate(db, callback, config) {
  const migrations = readMigrationFiles(config);
  const migrationsTable = typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
  const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
  await db.run(migrationTableCreate);
  const dbMigrations = await db.values(
    sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
  );
  const lastDbMigration = dbMigrations[0] ?? void 0;
  const queriesToRun = [];
  for (const migration of migrations) {
    if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
      queriesToRun.push(
        ...migration.sql,
        `INSERT INTO \`${migrationsTable}\` ("hash", "created_at") VALUES('${migration.hash}', '${migration.folderMillis}')`
      );
    }
  }
  await callback(queriesToRun);
}
export {
  migrate
};
//# sourceMappingURL=migrator.js.map