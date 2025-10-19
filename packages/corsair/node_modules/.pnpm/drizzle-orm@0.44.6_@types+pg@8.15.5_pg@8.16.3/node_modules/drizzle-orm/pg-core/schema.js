import { entityKind, is } from "../entity.js";
import { SQL, sql } from "../sql/sql.js";
import { pgEnumObjectWithSchema, pgEnumWithSchema } from "./columns/enum.js";
import { pgSequenceWithSchema } from "./sequence.js";
import { pgTableWithSchema } from "./table.js";
import { pgMaterializedViewWithSchema, pgViewWithSchema } from "./view.js";
class PgSchema {
  constructor(schemaName) {
    this.schemaName = schemaName;
  }
  static [entityKind] = "PgSchema";
  table = (name, columns, extraConfig) => {
    return pgTableWithSchema(name, columns, extraConfig, this.schemaName);
  };
  view = (name, columns) => {
    return pgViewWithSchema(name, columns, this.schemaName);
  };
  materializedView = (name, columns) => {
    return pgMaterializedViewWithSchema(name, columns, this.schemaName);
  };
  enum(enumName, input) {
    return Array.isArray(input) ? pgEnumWithSchema(
      enumName,
      [...input],
      this.schemaName
    ) : pgEnumObjectWithSchema(enumName, input, this.schemaName);
  }
  sequence = (name, options) => {
    return pgSequenceWithSchema(name, options, this.schemaName);
  };
  getSQL() {
    return new SQL([sql.identifier(this.schemaName)]);
  }
  shouldOmitSQLParens() {
    return true;
  }
}
function isPgSchema(obj) {
  return is(obj, PgSchema);
}
function pgSchema(name) {
  if (name === "public") {
    throw new Error(
      `You can't specify 'public' as schema name. Postgres is using public schema by default. If you want to use 'public' schema, just use pgTable() instead of creating a schema`
    );
  }
  return new PgSchema(name);
}
export {
  PgSchema,
  isPgSchema,
  pgSchema
};
//# sourceMappingURL=schema.js.map