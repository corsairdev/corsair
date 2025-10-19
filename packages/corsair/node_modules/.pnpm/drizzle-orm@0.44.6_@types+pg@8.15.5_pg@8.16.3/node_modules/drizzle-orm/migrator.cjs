"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var migrator_exports = {};
__export(migrator_exports, {
  readMigrationFiles: () => readMigrationFiles
});
module.exports = __toCommonJS(migrator_exports);
var import_node_crypto = __toESM(require("node:crypto"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);
function readMigrationFiles(config) {
  const migrationFolderTo = config.migrationsFolder;
  const migrationQueries = [];
  const journalPath = `${migrationFolderTo}/meta/_journal.json`;
  if (!import_node_fs.default.existsSync(journalPath)) {
    throw new Error(`Can't find meta/_journal.json file`);
  }
  const journalAsString = import_node_fs.default.readFileSync(`${migrationFolderTo}/meta/_journal.json`).toString();
  const journal = JSON.parse(journalAsString);
  for (const journalEntry of journal.entries) {
    const migrationPath = `${migrationFolderTo}/${journalEntry.tag}.sql`;
    try {
      const query = import_node_fs.default.readFileSync(`${migrationFolderTo}/${journalEntry.tag}.sql`).toString();
      const result = query.split("--> statement-breakpoint").map((it) => {
        return it;
      });
      migrationQueries.push({
        sql: result,
        bps: journalEntry.breakpoints,
        folderMillis: journalEntry.when,
        hash: import_node_crypto.default.createHash("sha256").update(query).digest("hex")
      });
    } catch {
      throw new Error(`No file ${migrationPath} found in ${migrationFolderTo} folder`);
    }
  }
  return migrationQueries;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  readMigrationFiles
});
//# sourceMappingURL=migrator.cjs.map