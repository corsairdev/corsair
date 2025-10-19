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
async function migrate(db, callback, config) {
  const migrations = (0, import_migrator.readMigrationFiles)(config);
  const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
  const migrationTableCreate = import_sql.sql`
		create table if not exists ${import_sql.sql.identifier(migrationsTable)} (
			id serial primary key,
			hash text not null,
			created_at bigint
		)
	`;
  await db.execute(migrationTableCreate);
  const dbMigrations = await db.select({
    id: import_sql.sql.raw("id"),
    hash: import_sql.sql.raw("hash"),
    created_at: import_sql.sql.raw("created_at")
  }).from(import_sql.sql.identifier(migrationsTable).getSQL()).orderBy(
    import_sql.sql.raw("created_at desc")
  ).limit(1);
  const lastDbMigration = dbMigrations[0];
  const queriesToRun = [];
  for (const migration of migrations) {
    if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
      queriesToRun.push(
        ...migration.sql,
        `insert into ${import_sql.sql.identifier(migrationsTable).value} (\`hash\`, \`created_at\`) values('${migration.hash}', '${migration.folderMillis}')`
      );
    }
  }
  await callback(queriesToRun);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  migrate
});
//# sourceMappingURL=migrator.cjs.map