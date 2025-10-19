import { readMigrationFiles } from "../migrator.js";
import { sql } from "../sql/sql.js";
async function migrate(db, config) {
  const migrations = readMigrationFiles(config);
  const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
  const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
  await db.session.run(migrationTableCreate);
  const dbMigrations = await db.values(
    sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
  );
  const lastDbMigration = dbMigrations[0] ?? void 0;
  const statementToBatch = [];
  for (const migration of migrations) {
    if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
      for (const stmt of migration.sql) {
        statementToBatch.push(db.run(sql.raw(stmt)));
      }
      statementToBatch.push(
        db.run(
          sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${sql.raw(`'${migration.hash}'`)}, ${sql.raw(`${migration.folderMillis}`)})`
        )
      );
    }
  }
  if (statementToBatch.length > 0) {
    await db.session.batch(statementToBatch);
  }
}
export {
  migrate
};
//# sourceMappingURL=migrator.js.map