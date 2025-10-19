import { readMigrationFiles } from "../migrator.js";
function migrate(db, config) {
  const migrations = readMigrationFiles(config);
  db.dialect.migrate(migrations, db.session, config);
}
export {
  migrate
};
//# sourceMappingURL=migrator.js.map