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
var import_sql = require("../sql/index.cjs");
function readMigrationFiles({ journal, migrations }) {
  const migrationQueries = [];
  for (const journalEntry of journal.entries) {
    const query = migrations[`m${journalEntry.idx.toString().padStart(4, "0")}`];
    if (!query) {
      throw new Error(`Missing migration: ${journalEntry.tag}`);
    }
    try {
      const result = query.split("--> statement-breakpoint").map((it) => {
        return it;
      });
      migrationQueries.push({
        sql: result,
        bps: journalEntry.breakpoints,
        folderMillis: journalEntry.when,
        hash: ""
      });
    } catch {
      throw new Error(`Failed to parse migration: ${journalEntry.tag}`);
    }
  }
  return migrationQueries;
}
async function migrate(db, config) {
  const migrations = readMigrationFiles(config);
  db.transaction((tx) => {
    try {
      const migrationsTable = "__drizzle_migrations";
      const migrationTableCreate = import_sql.sql`
				CREATE TABLE IF NOT EXISTS ${import_sql.sql.identifier(migrationsTable)} (
					id SERIAL PRIMARY KEY,
					hash text NOT NULL,
					created_at numeric
				)
			`;
      db.run(migrationTableCreate);
      const dbMigrations = db.values(
        import_sql.sql`SELECT id, hash, created_at FROM ${import_sql.sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
      );
      const lastDbMigration = dbMigrations[0] ?? void 0;
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            db.run(import_sql.sql.raw(stmt));
          }
          db.run(
            import_sql.sql`INSERT INTO ${import_sql.sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
    } catch (error) {
      tx.rollback();
      throw error;
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  migrate
});
//# sourceMappingURL=migrator.cjs.map