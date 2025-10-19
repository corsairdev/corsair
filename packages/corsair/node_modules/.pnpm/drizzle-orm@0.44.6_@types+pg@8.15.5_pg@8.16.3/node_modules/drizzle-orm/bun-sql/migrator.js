import { readMigrationFiles } from "../migrator.js";
async function migrate(db, config) {
  const migrations = readMigrationFiles(config);
  await db.dialect.migrate(migrations, db.session, config);
}
export {
  migrate
};
//# sourceMappingURL=migrator.js.map