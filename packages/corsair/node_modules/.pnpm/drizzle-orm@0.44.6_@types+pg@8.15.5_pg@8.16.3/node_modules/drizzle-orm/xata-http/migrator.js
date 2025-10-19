import { readMigrationFiles } from "../migrator.js";
import { sql } from "../sql/sql.js";
async function migrate(db, config) {
  const migrations = readMigrationFiles(config);
  const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
  const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at bigint
		)
	`;
  await db.session.execute(migrationTableCreate);
  const dbMigrations = await db.session.all(
    sql`select id, hash, created_at from ${sql.identifier(migrationsTable)} order by created_at desc limit 1`
  );
  const lastDbMigration = dbMigrations[0];
  for await (const migration of migrations) {
    if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
      for (const stmt of migration.sql) {
        await db.session.execute(sql.raw(stmt));
      }
      await db.session.execute(
        sql`insert into ${sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`
      );
    }
  }
}
export {
  migrate
};
//# sourceMappingURL=migrator.js.map