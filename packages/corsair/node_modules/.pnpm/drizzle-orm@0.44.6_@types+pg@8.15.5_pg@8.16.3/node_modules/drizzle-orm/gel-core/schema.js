import { entityKind, is } from "../entity.js";
import { SQL, sql } from "../sql/sql.js";
import { gelSequenceWithSchema } from "./sequence.js";
import { gelTableWithSchema } from "./table.js";
class GelSchema {
  constructor(schemaName) {
    this.schemaName = schemaName;
  }
  static [entityKind] = "GelSchema";
  table = (name, columns, extraConfig) => {
    return gelTableWithSchema(name, columns, extraConfig, this.schemaName);
  };
  // view = ((name, columns) => {
  // 	return gelViewWithSchema(name, columns, this.schemaName);
  // }) as typeof gelView;
  // materializedView = ((name, columns) => {
  // 	return gelMaterializedViewWithSchema(name, columns, this.schemaName);
  // }) as typeof gelMaterializedView;
  // enum: typeof gelEnum = ((name, values) => {
  // 	return gelEnumWithSchema(name, values, this.schemaName);
  // });
  sequence = (name, options) => {
    return gelSequenceWithSchema(name, options, this.schemaName);
  };
  getSQL() {
    return new SQL([sql.identifier(this.schemaName)]);
  }
  shouldOmitSQLParens() {
    return true;
  }
}
function isGelSchema(obj) {
  return is(obj, GelSchema);
}
function gelSchema(name) {
  if (name === "public") {
    throw new Error(
      `You can't specify 'public' as schema name. Postgres is using public schema by default. If you want to use 'public' schema, just use GelTable() instead of creating a schema`
    );
  }
  return new GelSchema(name);
}
export {
  GelSchema,
  gelSchema,
  isGelSchema
};
//# sourceMappingURL=schema.js.map