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
  migrate: () => migrate,
  useMigrations: () => useMigrations
});
module.exports = __toCommonJS(migrator_exports);
var import_react = require("react");
async function readMigrationFiles({ journal, migrations }) {
  const migrationQueries = [];
  for await (const journalEntry of journal.entries) {
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
  const migrations = await readMigrationFiles(config);
  return db.dialect.migrate(migrations, db.session);
}
const useMigrations = (db, migrations) => {
  const initialState = {
    success: false,
    error: void 0
  };
  const fetchReducer = (state2, action) => {
    switch (action.type) {
      case "migrating": {
        return { ...initialState };
      }
      case "migrated": {
        return { ...initialState, success: action.payload };
      }
      case "error": {
        return { ...initialState, error: action.payload };
      }
      default: {
        return state2;
      }
    }
  };
  const [state, dispatch] = (0, import_react.useReducer)(fetchReducer, initialState);
  (0, import_react.useEffect)(() => {
    dispatch({ type: "migrating" });
    migrate(db, migrations).then(() => {
      dispatch({ type: "migrated", payload: true });
    }).catch((error) => {
      dispatch({ type: "error", payload: error });
    });
  }, []);
  return state;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  migrate,
  useMigrations
});
//# sourceMappingURL=migrator.cjs.map