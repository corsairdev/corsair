"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var migrator_exports = {};
__export(migrator_exports, {
  migrate: () => migrate
});
module.exports = __toCommonJS(migrator_exports);
var import_migrator = require("../migrator.cjs");
var import_sql = require("../sql/sql.cjs");
async function migrate(db, config) {
  const migrations = (0, import_migrator.readMigrationFiles)(config);
  const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
  const migrationsSchema = config.migrationsSchema ?? "drizzle";
  const migrationTableCreate = import_sql.sql`
		CREATE TABLE IF NOT EXISTS ${import_sql.sql.identifier(migrationsSchema)}.${import_sql.sql.identifier(migrationsTable)} (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at bigint
		)
	`;
  await db.session.execute(import_sql.sql`CREATE SCHEMA IF NOT EXISTS ${import_sql.sql.identifier(migrationsSchema)}`);
  await db.session.execute(migrationTableCreate);
  const dbMigrations = await db.session.all(
    import_sql.sql`select id, hash, created_at from ${import_sql.sql.identifier(migrationsSchema)}.${import_sql.sql.identifier(migrationsTable)} order by created_at desc limit 1`
  );
  const lastDbMigration = dbMigrations[0];
  const rowsToInsert = [];
  for await (const migration of migrations) {
    if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
      for (const stmt of migration.sql) {
        await db.session.execute(import_sql.sql.raw(stmt));
      }
      rowsToInsert.push(
        import_sql.sql`insert into ${import_sql.sql.identifier(migrationsSchema)}.${import_sql.sql.identifier(migrationsTable)} ("hash", "created_at") values(${migration.hash}, ${migration.folderMillis})`
      );
    }
  }
  for await (const rowToInsert of rowsToInsert) {
    await db.session.execute(rowToInsert);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  migrate
});
//# sourceMappingURL=migrator.cjs.map